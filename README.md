# Serviço Angular de Integração com Fluig via OAuth 1.0a

Este serviço Angular tem como objetivo facilitar a comunicação com a plataforma **Fluig**, utilizando autenticação baseada no protocolo **OAuth 1.0a**. Ele oferece uma interface simples para realizar requisições HTTP autenticadas (`GET`, `POST`, `PUT` e `DELETE`).

---

## 📦 Funcionalidades

- [x] Autenticação automática com **OAuth 1.0a**
- [x] Requisições HTTP autenticadas: `GET`, `POST`, `PUT`, `DELETE`
- [x] Suporte a downloads via `Blob`
- [x] Tipagem genérica com `Observable<T>`
- [ ] Tratamento de erros com `RxJS`

---

## 📥 Instalação

Você pode instalar este serviço de duas formas:

### ✅ Via NPM (Recomendado)

```bash
npm install --save fluig-auth
```

### 🛠️ Compilando o projeto localmente

1. Clone o repositório do GitHub:

```bash
git clone https://github.com/gabrielgnsilva/fluig-auth.git
cd fluig-auth
```

2. Compile o pacote:

```bash
ng build fluig-auth
```

3. Instale diretamente no seu projeto:

```bash
npm install ./dist/fluig-auth
```

---

## 🚀 Uso

### 1. Importação

Certifique-se de importar e injetar o serviço no seu componente ou outro serviço Angular:

```ts
constructor(private fluigService: FluigAuthService) {}
```

### 2. Requisições

Use o método `makeRequest` para acessar os métodos disponíveis:

#### GET

```ts
this.fluigService.makeRequest
  .GET<DataType>("https://fluig-url/api/path", {
    param1: "value1",
  })
  .subscribe((response) => {
    console.log(response);
  });
```

#### POST

```ts
this.fluigService.makeRequest.POST<DataType>("https://fluig-url/api/path", { key: "value" }, { param1: "value1" }).subscribe((response) => {
  console.log(response);
});
```

#### PUT

```ts
this.fluigService.makeRequest.PUT<DataType>("https://fluig-url/api/path", { key: "updatedValue" }, { param1: "value1" }).subscribe((response) => {
  console.log(response);
});
```

#### DELETE

```ts
this.fluigService.makeRequest.DELETE<DataType>("https://fluig-url/api/path", { param1: "value1" }).subscribe((response) => {
  console.log(response);
});
```

---

## 📁 Requisição Blob

Para respostas do tipo `Blob`, como arquivos:

```ts
this.fluigService
  .makeBlobRequest("https://fluig-url/api/file/download", {
    fileId: "123",
  })
  .subscribe((blob) => {
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  });
```

---

## 🔐 Autenticação OAuth 1.0a

Este serviço utiliza headers autenticados via OAuth 1.0a. Os headers são automaticamente configurados através do método interno `setHeaders`.

### Configuração necessária no `app.config.ts`

Você pode configurar a autenticação de duas formas:

#### ✅ Usando `FLUIG_AUTH_CONFIG` diretamente

```ts
import { FLUIG_AUTH_CONFIG } from "fluig-auth";
import { environment } from "../environments/environment";

export const appConfig: ApplicationConfig = {
  providers: [{ provide: FLUIG_AUTH_CONFIG, useValue: environment.auth }],
};
```

#### ✅ Ou usando a função `provideFluigAuth()` para simplificar

```ts
import { provideFluigAuth } from "fluig-auth";

export const appConfig: ApplicationConfig = {
  providers: [provideFluigAuth(environment.auth)],
};
```

### ⚠️ Uso seguro com `environments`

Evite expor suas chaves de autenticação em ambientes de desenvolvimento ou produção. É imprescindivel que utilize o configurador por ambiente do angular: [Configuring application environments](https://angular.dev/tools/cli/environments). Dessa forma, quando `auth.development` for `false` será utilizado o token de autentificação do usuário.

Use o sistema de **file replacements** do Angular para gerenciar configurações diferentes entre ambientes:

#### `angular.json`

```json
"configurations": {
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ]
  }
}
```

#### `environment.ts` (desenvolvimento)

```ts
export const environment = {
  auth: {
    url: "", // FLUIG URL
    development: true,
    oauth: {
      type: "app", // 'app' ou 'token'
      token: "",
      app: {
        requestURL: "",
        accessURL: "",
        authorizeURL: "",
        consumerKey: "",
        consumerSecret: "",
        accessToken: "",
        tokenSecret: "",
      },
    },
  },
};
```

#### `environment.prod.ts` (produção)

```ts
export const environment = {
  auth: {
    url: "",
    development: false,
    oauth: {
      type: "app",
      token: "",
      app: {
        requestURL: "",
        accessURL: "",
        authorizeURL: "",
        consumerKey: "",
        consumerSecret: "",
        accessToken: "",
        tokenSecret: "",
      },
    },
  },
};
```

---

## 🧠 Observações

- Todos os métodos retornam um `Observable<T>`, permitindo fácil integração com o Angular.
- Os erros são lançados como `Error`, podendo ser tratados em `catchError` ou `subscribe`.
- Quando `oauth.type` for `'token'`, o campo `oauth.token` será usado diretamente como Bearer Token.
- Quando `oauth.type` for `'app'`, será utilizada a autenticação com usuário aplicativo (Para mais informações, consulte a [documentação oficial do Fluig](https://tdn.totvs.com/pages/releaseview.action?pageId=234455783)).

---

## 🧪 Dica Extra: Proxy Reverso durante o Desenvolvimento

Durante o desenvolvimento local, é comum enfrentar problemas de CORS ao tentar acessar o Fluig diretamente. Uma solução prática é configurar um **proxy reverso** para redirecionar requisições locais para o servidor Fluig.

Você pode configurar isso com um arquivo `proxy.conf.json` e usá-lo em conjunto com o `ng serve`:

```json
{
  "/api": {
    "target": "https://fluig.seuservidor.com",
    "secure": true,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

Em seguida, rode o Angular com:

```bash
ng serve --proxy-config proxy.conf.json
```

📖 Leia mais sobre isso no post: [Como Resolver Problemas de CORS com Fluig Usando Proxy Reverso no Angular](https://devoncommand.com/pt/posts/programming/2025/proxy-angular-fluig/)
