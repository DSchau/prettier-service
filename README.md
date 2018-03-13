# prettier-service

A simple Serverless (Lambda) service to run prettier on passed in code

## GET `/prettier`

The only required query parameter is `code`, but all additional params will be passed directly to prettier.

### Sample

`/prettier?code=foo%20()%3B&semi=false`

#### Response

```json
{
  "code": "foo()\n"
}
```

## POST `prettier`

The post endpoint similarly exists and accepts JSON

### Sample

```json
{
  "code": "foo ();",
  "semi": false
}
```

#### Response

```json
{
  "code": "foo()\n"
}
```
