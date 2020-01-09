# localizationkeys-webpack

The localization keys generator from JSONC file. It generates a typescript class with static fields that have values is path to JSON value.
The main advantage is that when your jsonc has been changed then typescipt class will be changed too. So. If you remove localization from default language json file then you have an compile error.

## Installation

```
npm install --save localizationkeys-webpack
```

## Setup

### `className`. Optional
Default is `LocalizationKeys`. The name of class

### `output`. Optional
Default is `./LocalizationKeys.ts`. The path of generated typescript file

## Usage

### Simple usage
Your localization `default.jsonc` is in `localization` folder.

`webpack.config.js` file:
```js
...

module.exports = () => {
    return [{
        ...
        module: {
            ...
            rules: [
                ...
                {
                    test: /\.jsonc$/,
                    include: /localization/,
                    use: [
                        "json-loader"
                    ],
                    type: "javascript/auto"
                },
                {
                    test: /default\.jsonc$/,
                    type: "javascript/auto",
                    use: [{
                        loader: "localizationkeys-webpack?className=LocalizationKeys&output=./LocalizationKeys.ts"
                    }]
                }
                ...
            ]
            ...
        }
        ...
    }];
    ...
}
```
`json-loader` is used to load exact localization values as an object.
Somewhere in your app:
```typescript
const defaultLanguage = required("localization/default.jsonc");
```

`default.jsonc` file:
```jsonc
{
    "Hello": "{0}! Hello World!", // {0} - user full name
    "Boolean": {
        "true": "Ja",
        "nein": "Nein"
    }
}
``` 
`JSONC` supports comments. So you can leave some comment if you localization value has replacement token(s) to share knowledge with someone who will make translation.

The generated `LocalizationKeys` will be:
```typescript
export default class LocalizationKeys
{
    Hello= "Hello";
    public static Boolean = 
    {
        AllKeys: "Boolean",
        true: "Boolean.true",
        nein: "Boolean.nein",
    }
}
```

## Credits
[Alexey Ripenko](http://ripenko.ru/), [GitHub](https://github.com/ripenko/)

## License

MIT
