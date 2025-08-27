import * as vscode from 'vscode';
import express, { Request, Response } from 'express';



export function activate(context: vscode.ExtensionContext) {

    // Cria uma nova aplicação Express

    const app = express();

    const port = 3000;



    console.log('Parabéns, sua extensão "vscode-diagnostics-server" está ativa!');



    // Endpoint para obter os diagnósticos do VS Code

app.get('/diagnostics', (req: Request, res: Response) => {

        // Coleta todos os diagnósticos de todos os arquivos abertos no VS Code

        const allDiagnostics = vscode.languages.getDiagnostics();



        // Mapeia os diagnósticos para o formato desejado

        const formattedDiagnostics = allDiagnostics.flatMap(diagEntry => {

            const uri = diagEntry[0]; // URI do documento

            const diagnostics = diagEntry[1]; // Array de diagnósticos para aquele documento



            return diagnostics.map(diag => ({

                file: uri.fsPath, // Caminho completo do arquivo

                severity: vscode.DiagnosticSeverity[diag.severity], // Transforma a severidade em string (e.g., "Error", "Warning")

                message: diag.message, // Mensagem do diagnóstico

                range: {

                    start: {

                        line: diag.range.start.line,

                        character: diag.range.start.character

                    },

                    end: {

                        line: diag.range.end.line,

                        character: diag.range.end.character

                    }

                },

                source: diag.source // Fonte do diagnóstico (e.g., "eslint", "typescript")

            }));

        });



        // Retorna os diagnósticos formatados como JSON

        res.json(formattedDiagnostics);

    });



    // Inicia o servidor Express

    app.listen(port, () => {

        console.log(`Servidor de diagnostics rodando em http://localhost:${port}`);

    });



    // Adiciona um comando de exemplo (apenas para manter a estrutura original do template)

    let disposable = vscode.commands.registerCommand('vscode-diagnostics-server.helloWorld', () => {

        vscode.window.showInformationMessage('Hello World from VS Code Diagnostics Server!');

    });



    context.subscriptions.push(disposable);

}



// Este método é chamado quando sua extensão é desativada

export function deactivate() {

    // Lógica para desativar a extensão (neste caso, o servidor será encerrado

    // quando o processo da extensão for finalizado pelo VS Code)

    console.log('Extensão "vscode-diagnostics-server" desativada.');

}