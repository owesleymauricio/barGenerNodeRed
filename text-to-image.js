const bwipjs = require('bwip-js');

module.exports = function (RED) {
    function TextToImageNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function (msg) {
            // Configuração do padrão de texto
            const textPattern = msg.payload.match(/.{1,4}/g).join("  ");

            // Configurações do código de barras
            const opts = {
                bcid: 'code128',       // Código de barras a ser gerado, por exemplo, 'code128'
                text: textPattern,     // Texto a ser codificado
                scale: 2,              // Escala do código de barras
                height: 40,            // Altura do código de barras em pontos
                includetext: true,     // Incluir texto no código de barras
                textxalign: 'center',  // Alinhamento horizontal do texto
            };

            // Gera o código de barras
            bwipjs.toBuffer(opts, function (err, png) {
                if (err) {
                    node.error(err, msg);
                } else {
                    // Converte o buffer PNG em uma imagem (base64)
                    msg.payload = 'data:image/png;base64,' + png.toString('base64');
                    // Envia a mensagem
                    node.send(msg);
                }
            });
        });
    }

    // Registra o node
    RED.nodes.registerType("text-to-image", TextToImageNode);
};
