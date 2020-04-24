module.exports = Object.freeze({
    WEBSITEAPI: 'https://thuor.com/webhooks/webhookshopify/rotas',
    WEBSITECHECKOUT: 'http://localhost:8081/cart/items?',
    VERSAO_API: '2020-04',
    RESOURCE_PRODUCTS: 'products',
    RESOURCE_WEBHOOKS: 'webhooks',
    RESOURCE_TEMAS: 'themes',
    RESOURCE_THUOR_SPNIPPET_LIQUID: 'snippets/ThuorSnippet.liquid',
    RESOURCE_THUOR_THEME_LIQUID: 'layout/theme.liquid',
    RESOURCE_THUOR_THEME_LIQUID_EDIT_CONTENT: "<br/><!-- Não remova. Checkout Thuor. -->     {% capture thuor_snippet_content %}{% include 'ThuorSnippet' %}{% endcapture %} {% unless thuor_snippet_content contains 'Liquid error' %} {% include 'ThuorSnippet' %} {% endunless %}     <!-- Não remova. Checkout Thuor. --> <br/> </body>"
    
});