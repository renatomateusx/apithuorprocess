module.exports = Object.freeze({
    PLATAFORMA_SHOPIFY: 1,


    GATEWAY_MP: 1,
    GATEWAY_PS: 2,
    GATEWAY_PayU: 3,
    API_MP: 'https://api.mercadopago.com/v1/payments/{id}?access_token={token}',
    API_PS: 'https://sandbox.api.pagseguro.com/{}',
    API_PAYU: 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi',
    API_PAYU_REPORT: 'https://sandbox.api.payulatam.com/reports-api/4.0/service.cgi',

    SAND_BOX_MP_PUBLICK_KEY: 'TEST-5e8249a3-5691-4ae9-bf45-8705c09b5c0e',
    SAND_BOX_MP_ACCESS_TOKEN: 'TEST-4338451460338304-120717-21b6daffeb2a7bd8ba4a59afb113f0fe-128404654',
    PRODUCAO_BOX_MP_PUBLICK_KEY: 'APP_USR-c97da455-7446-4595-968b-75677fcc12d1',
    PRODUCAO_BOX_MP_ACCESS_TOKEN: 'APP_USR-4338451460338304-120717-64a42a12fe590e1715881018b78df091-128404654',

    WEBSITE: 'https://app.thuor.com',
    WEBSITE_ACTIVATE_EMAIL: 'https://app.thuor.com/ativacao/',
    WEBSITE_ACTIVATE_RESET_SENHA: 'https://app.thuor.com/redefinir/',
    WEBSITE_CART: 'https://app.thuor.com/cart/items?',
    WEBSITEAPI: 'https://api.thuor.com:7443/webhooks/webhookshopify/rotas',
    WEB_HOOK_PAYU: 'https://api.thuor.com:7443/webhooks/webhookpayu',
    // WEBSITECHECKOUT: 'http://localhost:8081/cart/items?',
    WEBSITECHECKOUT: 'https://app.thuor.com/cart/items?',
    VERSAO_API: '2020-04',
    RESOURCE_PRODUCTS: 'products',
    RESOURCE_WEBHOOKS: 'webhooks',
    RESOURCE_TEMAS: 'themes',
    RESOURCE_ORDERS: 'orders',
    RESOURCE_TRANSACTIONS: 'transactions',
    REFOUND_ORDER: 'refound',
    RESOURCE_THUOR_SPNIPPET_LIQUID: 'snippets/ThuorSnippet.liquid',
    RESOURCE_THUOR_SPNIPPET_APP_POPUP_LIQUID: 'snippets/ThuorPopUpSnippet.liquid',
    RESOURCE_THUOR_SPNIPPET_REVIEW_LIQUID: 'snippets/ThuorReviewSnippet.liquid',
    RESOURCE_THUOR_SPNIPPET_PARCEL_LIQUID: 'snippets/ThuorParcelSnippet.liquid',
    RESOURCE_THUOR_SPNIPPET_CROSS_SELL_LIQUID: 'snippets/ThuorCrossSellSnippet.liquid',
    RESOURCE_THUOR_THEME_LIQUID: 'layout/theme.liquid',
    RESOURCE_THUOR_PRODUCT_LIQUID: 'templates/product.liquid',
    RESOURCE_THUOR_CART_LIQUID: 'templates/cart.liquid',
    RESOURCE_THUOR_APP_PARCEL_PRODUCT_LIQUID: 'sections/product.liquid',
    RESOURCE_THUOR_THEME_LIQUID_EDIT_CONTENT: "<!-- Não remova. Checkout Thuor. -->     {% capture thuor_snippet_content %}{% include 'ThuorSnippet' %}{% endcapture %} {% unless thuor_snippet_content contains 'Liquid error' %} {% include 'ThuorSnippet' %} {% endunless %}     <!-- Não remova. Checkout Thuor. -->",
    RESOURCE_THUOR_POP_UP_THEME_LIQUID_EDIT_CONTENT: "<!-- Não remova. PopUp Thuor. -->     {% capture thuor_pop_up_snippet_content %}{% include 'ThuorPopUpSnippet' %}{% endcapture %} {% unless thuor_pop_up_snippet_content contains 'Liquid error' %} {% include 'ThuorPopUpSnippet' %} {% endunless %}     <!-- Não remova. PopUp Thuor. -->",
    RESOURCE_THUOR_THEME_LIQUID_EDIT_CONTENT_YAMPI: "<!-- Não remova. Checkout Yampi. -->{% capture yampi_snippet_content %}{% include 'YampiSnippet' %}{% endcapture %} {% unless yampi_snippet_content contains 'Liquid error' %} {% include 'YampiSnippet' %} {% endunless %}<!-- Não remova. Checkout Yampi. -->",
    RESOURCE_THUOR_PRODUCT_LIQUID_EDIT_CONTENT: " <!-- Não remova. App Thuor Review. -->     {% capture thuor_review_snippet_content %}{% include 'ThuorReviewSnippet' %}{% endcapture %} {% unless thuor_review_snippet_content contains 'Liquid error' %} {% include 'ThuorReviewSnippet' %} {% endunless %}     <!-- Não remova. App Thuor Review. -->",
    RESOURCE_THUOR_PARCEL_APP_PRODUCT_LIQUID_EDIT_CONTENT: " <!-- Não remova. App Thuor Parcel. -->     {% capture thuor_parcel_snippet_content %}{% include 'ThuorParcelSnippet' %}{% endcapture %} {% unless thuor_parcel_snippet_content contains 'Liquid error' %} {% include 'ThuorParcelSnippet' %} {% endunless %}     <!-- Não remova. App Thuor Parcel. -->",
    RESOURCE_THUOR_CROSS_SELL_APP_PRODUCT_LIQUID_EDIT_CONTENT: " <!-- Não remova. App Thuor CrossSell. -->     {% capture thuor_cross_sell_snippet_content %}{% include 'ThuorCrossSellSnippet' %}{% endcapture %} {% unless thuor_cross_sell_snippet_content contains 'Liquid error' %} {% include 'ThuorCrossSellSnippet' %} {% endunless %}     <!-- Não remova. App Thuor CrossSell. -->",
    
    //URL_TRACK_CODE: 'http://localhost:8081/track/@',
    URL_TRACK_CODE: 'https://app.thuor.com/track/@',

    // URL_PUBLIC_RESOURCES_EMAIL: 'http://localhost:3000/images/templates',
    URL_PUBLIC_RESOURCES_EMAIL: 'https://api.thuor.com/public/images/templates',
    FROM_MAIL:'{nome_loja} <{email_loja}>',
    STRING_SUBJECT_EMAIL_ENCOMENDA_RASTREIO: 'Sua encomenda está quase chegando!',
    STRING_SUBJECT_EMAIL_ENCOMENDA_RASTREIO_ENTREGUE: 'Sua encomenda foi entregue!',
    STRING_SUBJECT_EMAIL_ATIVAR_CONTA: 'Ative Sua Conta e Comece a Usar o Thuor Hoje Mesmo!',
    STRING_SUBJECT_EMAIL_ESQUECEU_SENHA: 'Esqueceu a senha? Segue link para redefinição.',
    STRING_SUBJECT_EMAIL_BOLETO: 'Seu pedido #{pedido} vence {data_vencimento}.',
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
    attachmentsEmailBoleto: [{
        filename: 'Img7_2x.jpg',
        path: 'URL_PUBLIC_RESOURCES',
        cid: 'Img7_2x' //same cid value as in the html img src
    }, {
        filename: 'logoThuorBlue.png',
        path: 'URL_PUBLIC_RESOURCES',
        cid: 'logoThuorBlue' //same cid value as in the html img src
    }],


    CC_REJECTED_BAD_FILLED_CARD_NUMBER: 'Revise o número do cartão.',

    HML_HOST_SMTP: 'gmail.com',
    HML_HOST_SERVICE: 'gmail',
    HML_PORT_SMTP: '587',
    HML_USER_SMTP: 'tohrmoura@gmail.com',
    HML_PASS_SMTP: '02997841500',
    HML_EMAIL_FROM: "no-replay@thuor.com",
    HML_EMAIL_FROM_TESTES: "renatomateusx@gmail.com",

    HOST_SMTP: 'in-v3.mailjet.com',
    HOST_SERVICE: 'mailjet',
    PORT_SMTP: '587',
    USER_SMTP: '1028cb1452db730d788e8839e5964d29',
    PASS_SMTP: '4b6b1c2c2932b278f8a94ce169d348db',
    EMAIL_FROM: "no-reply@thuor.com",
    EMAIL_FROM_TAG: "<no-reply@thuor.com>",
    NOME_FROM: "Thuor",
    EMAIL_FROM_TESTES: "renatomateusx@gmail.com",

    CONSTANTE_ID_CAMPANHA_CARRINHO_ABANDONADO: 1,


    /* TESTES */
    CONSTANTE_TESTES: true,


    /* CANCELA BOLETO API MP */
    END_POINT_CANCELA_BOLETO_API_MP: 'https://api.mercadopago.com/v1/advanced_payments/{ID}?access_token={TOKEN}',



});