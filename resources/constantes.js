module.exports = Object.freeze({
    SAND_BOX_MP_PUBLICK_KEY: 'TEST-5e8249a3-5691-4ae9-bf45-8705c09b5c0e',
    SAND_BOX_MP_ACCESS_TOKEN: 'TEST-4338451460338304-120717-21b6daffeb2a7bd8ba4a59afb113f0fe-128404654',
    PRODUCAO_BOX_MP_PUBLICK_KEY: 'APP_USR-c97da455-7446-4595-968b-75677fcc12d1',
    PRODUCAO_BOX_MP_ACCESS_TOKEN: 'APP_USR-4338451460338304-120717-64a42a12fe590e1715881018b78df091-128404654',

    WEBSITE: 'https://thuor.com',
    WEBSITE_ACTIVATE_EMAIL: 'https://thuor.com/ativacao/',
    WEBSITE_ACTIVATE_RESET_SENHA: 'https://thuor.com/redefinir/',
    WEBSITE_CART: 'https://thuor.com/cart/items?',
    WEBSITEAPI: 'https://api.thuor.com/webhooks/webhookshopify/rotas',
    WEB_HOOK_PAYU: 'https://api.thuor.com/webhooks/webhookpayu',
    WEBSITECHECKOUT: 'http://localhost:8081/cart/items?',
    VERSAO_API: '2020-04',
    RESOURCE_PRODUCTS: 'products',
    RESOURCE_WEBHOOKS: 'webhooks',
    RESOURCE_TEMAS: 'themes',
    RESOURCE_ORDERS: 'orders',
    REFOUND_ORDER: 'refound',
    RESOURCE_THUOR_SPNIPPET_LIQUID: 'snippets/ThuorSnippet.liquid',
    RESOURCE_THUOR_THEME_LIQUID: 'layout/theme.liquid',
    RESOURCE_THUOR_THEME_LIQUID_EDIT_CONTENT: "<br/><!-- Não remova. Checkout Thuor. -->     {% capture thuor_snippet_content %}{% include 'ThuorSnippet' %}{% endcapture %} {% unless thuor_snippet_content contains 'Liquid error' %} {% include 'ThuorSnippet' %} {% endunless %}     <!-- Não remova. Checkout Thuor. --> <br/> </body>",

    URL_TRACK_CODE: 'http://localhost:8081/track/@',

    URL_PUBLIC_RESOURCES_EMAIL: 'http://localhost:3000/images/templates',
    STRING_SUBJECT_EMAIL_ENCOMENDA_RASTREIO: 'Sua encomenda está quase chegando!',
    STRING_SUBJECT_EMAIL_ATIVAR_CONTA: 'Ative Sua Conta e Comece a Usar o Thuor Hoje Mesmo!',
    STRING_SUBJECT_EMAIL_ESQUECEU_SENHA: 'Esqueceu a senha? Segue link para redefinição.',
    STRING_SUBJECT_EMAIL_ALTEROU_SENHA: 'Alteração de Senha no Thuor.com',
    STRING_STATUS_EMAIL: '{STATUS} {LOCAL} {LOCAL_CIDADE} {DATA}',
    attachmentsAux: [{
        filename: 'facebook2x.png',
        path: 'URL_PUBLIC_RESOURCES',
        cid: 'facebook2x' //same cid value as in the html img src
    }, {
        filename: 'twitter2x.png',
        path: 'URL_PUBLIC_RESOURCES',
        cid: 'twitter2x' //same cid value as in the html img src
    }, {
        filename: 'instagram2x.png',
        path: 'URL_PUBLIC_RESOURCES',
        cid: 'linkedin2x' //same cid value as in the html img src
    }, {
        filename: 'linkedin2x.png',
        path: 'URL_PUBLIC_RESOURCES',
        cid: 'linkedin2x' //same cid value as in the html img src
    }, {
        filename: 'footer.png',
        path: 'URL_PUBLIC_RESOURCES',
        cid: 'footer' //same cid value as in the html img src
    },],
    attachmentsAuxCartAbandon: [{
        filename: 'rounded_corner_1.png',
        path: 'URL_PUBLIC_RESOURCES',
        cid: 'rounded_corner_1' //same cid value as in the html img src
    },
    {
        filename: 'Cart.gif',
        path: 'URL_PUBLIC_RESOURCES',
        cid: 'Cart'
    }, {
        filename: 'Bottom_round.png',
        path: 'URL_PUBLIC_RESOURCES',
        cid: 'Bottom_round'
    }],
    attachmentsEmailRastreio: [{
        filename: 'Img62x.jpg',
        path: 'URL_PUBLIC_RESOURCES',
        cid: 'Img62x' //same cid value as in the html img src
    }],
    attachmentsEmailRedefineSenha: [{
        filename: 'Img22x.jpg',
        path: 'URL_PUBLIC_RESOURCES',
        cid: 'Img22x' //same cid value as in the html img src
    }, {
        filename: 'logoThuorBlue.png',
        path: 'URL_PUBLIC_RESOURCES',
        cid: 'logoThuorBlue' //same cid value as in the html img src
    }],
    attachmentsEmailAtivacao: [{
        filename: 'logoThuorBlue.png',
        path: 'URL_PUBLIC_RESOURCES',
        cid: 'logoThuorBlue' //same cid value as in the html img src
    }, {
        filename: 'illo_welcome_1.png',
        path: 'URL_PUBLIC_RESOURCES',
        cid: 'illo_welcome_1' //same cid value as in the html img src
    }],



    CC_REJECTED_BAD_FILLED_CARD_NUMBER: 'Revise o número do cartão.',

    HOST_SMTP: 'gmail.com',
    HOST_SERVICE: 'gmail',
    PORT_SMTP: '587',
    USER_SMTP: 'tohrmoura@gmail.com',
    PASS_SMTP: '02997841500',
    EMAIL_FROM: "no-replay@thuor.com",
    EMAIL_FROM_TESTES: "renatomateusx@gmail.com",


    CONSTANTE_ID_CAMPANHA_CARRINHO_ABANDONADO: 1,








});