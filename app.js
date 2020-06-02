require('dotenv-safe').load();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.options('*', cors());

/*Rotas */
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var chatsRouter = require('./routes/chat.message');
var chatsListRouter = require('./routes/chat.list.message');
var tokenPagamento = require('./routes/token.pagamento');
var combinacaoRouter = require('./routes/combinacoes');
var superlikeRouter = require('./routes/superlikes');
var visitasRouter = require('./routes/visitas');
var extrasRouter = require('./routes/extras');
var pagamentosRouter = require('./routes/pagamentos');
var push = require('./routes/push');
var notificacaoRouter = require('./routes/notificacao');
var integraFuncionalidadeShopify = require('./routes/componentes/Shopify/integracaoShopify');
var produtos = require('./routes/produtos');
var integracaoShopify = require('./routes/integracaoShopify');
var logisticas = require('./routes/logisticas');
var integracaoMP = require('./routes/componentes/MP/integracaoMP');
var checkouts = require('./routes/checkouts');
var transacao = require('./routes/transacao');
var webhookpagseguro = require('./webhooks/webhookpagseguro');
var webhookpayu = require('./webhooks/webhookpayu');
var webhookshopify = require('./webhooks/webhookshopify');
var upsells = require('./routes/upsells');
var mensageria = require('./routes/mensageria');
var pixels = require('./routes/pixels');
var clientes = require('./routes/clientes');
var services_shipment = require('./routes/services/serviceShippments');
var webhookshopify = require('./webhooks/webhookshopify');
var cupons = require('./routes/cupons');
var campanhas = require('./routes/integracaoCampanhas/campanhas');
var services_abandon_cart = require('./routes/services/serviceCartAbandon');
var reviews = require('./routes/reviews');
var apps = require('./routes/apps');
var servicesConsultaPagamento = require('./routes/services/serviceConsultaPagamentos');
var utilisEmail = require('./routes/utilisEmail');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ credentials: true, origin: '*' }));
app.options('*', cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chat', chatsRouter);
app.use('/chatlist', chatsListRouter);
app.use('/tokenpagamento', tokenPagamento);
app.use('/combinacoes', combinacaoRouter);
app.use('/superlikes', superlikeRouter);
app.use('/visitas', visitasRouter);
app.use('/extras', extrasRouter);
app.use('/pagamentos', pagamentosRouter);
app.use('/push', push);
app.use('/notificacao', notificacaoRouter);
app.use('/integraFuncionalidadeShopify', integraFuncionalidadeShopify);
app.use('/integracaoShopify', integracaoShopify);
app.use('/produtos', produtos);
app.use('/logisticas', logisticas);
app.use('/integracaoMP', integracaoMP);
app.use('/checkouts', checkouts);
app.use('/transacoes', transacao);
app.use('/webhookpagseguro', webhookpagseguro);
app.use('/webhookpayu', webhookpayu);
app.use('/webhookshopify', webhookshopify);
app.use('/upsells', upsells);
app.use('/mensageria', mensageria);
app.use('/pixels', pixels);
app.use('/clientes', clientes);
app.use('/servicesShipments', services_shipment);
app.use('/cupons', cupons);
app.use('/campanhas', campanhas);
app.use('/serviceCartAbandon', services_abandon_cart);
app.use('/reviews', reviews);
app.use('/apps', apps);
app.use('/servicesConsultaPagamento', servicesConsultaPagamento);
app.use('/utilisEmail', utilisEmail);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, Content-Type,Content-Length, Authorization, Accept, X-Requested-With'
  );
  res.header('Access-Control-Allow-Credentials', true);
  res.header(
    'Accept',
    'application/vnd.pagseguro.com.br.v3+{xml,json};charset=ISO-8859-1'
  );
  next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.use(bodyParser);

module.exports = app;
