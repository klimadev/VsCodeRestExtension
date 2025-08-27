"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const express_1 = __importDefault(require("express"));
function activate(context) {
    // Cria uma nova aplicação Express
    const app = (0, express_1.default)();
    const port = 3000;
    console.log('Parabéns, sua extensão "vscode-diagnostics-server" está ativa!');
    // Endpoint para obter os diagnósticos do VS Code
    app.get('/diagnostics', (req, res) => {
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
function deactivate() {
    // Lógica para desativar a extensão (neste caso, o servidor será encerrado
    // quando o processo da extensão for finalizado pelo VS Code)
    console.log('Extensão "vscode-diagnostics-server" desativada.');
}
//# sourceMappingURL=extension.js.map