---
layout: post
comments: true
title:  "Enhancing D365 with Customized Editable Grids"
date:   2024-07-19 08:00:00 +0800
categories: Technology
tags: [PowerPlatform, PowerApps, PCF, D365, Dynamics, Twitter, Facebook, LinkedIn]
sharing:
    twitter: "Enhancing D365 with Customized Editable Grids"
    facebook: "Enhancing D365 with Customized Editable Grids"
    linkedin: "Enhancing D365 with Customized Editable Grids"
---

## Intro
I have many years of D365 project delivery experience under my belt. There is always a demand for UX/UI improvement. 

With many years of D365 project delivery experience under my belt. I've seen consistent demand for UX/UI improvements. Enhancing user experience is critical, and Power Apps Code components offer developers the tool they need to meet specific UI requirements.

## Power Apps Code Components
The Power Platform Component Framework (PCF) empowers developers to extend Model-Driven Apps (MDAs) with custom UI components, tailored to specific needs, such as applying conditional formatting to highlight critical information.

### Code Components for forms
For instance, on forms, developers can create custom components like a choice picker to enhance field/column interactions.

### Code Components for views
For views, developers can build a Data Set Grid component, providing a more interactive and customized data presentation.

[Learn more about Data Set Grid components](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/sample-controls/customized-editable-grid-control)

## Customized Editable Grid
The Customized Editable Grid is a unique type of component. Unlike standard PCF components, it allows developers to manipulate rendering at the cell level, reducing the overall development effort. This flexibility makes it a powerful tool for tailoring grids within D365.

## My Demo Project
The demo project is simple yet effective: it renders text content in D365 view columns in green, providing a visual cue for users.

### The Project Template
The template control is available in the [PowerApps-Samples GitHub repository](https://github.com/microsoft/PowerApps-Samples). You’ll need to clone or download the repository to access the files in `PowerApps-Samples/component-framework/resources/GridCustomizerControlTemplate`.

#### Entry Point
The entry point is the `init` function of the index.ts file. The key functions, `cellRendererOverrides` and `cellEditorOverrides`, will be modified to achieve the desired customization.
```TypeScript
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        const eventName = context.parameters.EventName.raw;
        if (eventName) {
            const paOneGridCustomizer: PAOneGridCustomizer = { cellRendererOverrides, cellEditorOverrides };
            (context as any).factory.fireEvent(eventName, paOneGridCustomizer);
        }
    }
```

### The Sample Code
I have simplify [the sample code](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/sample-controls/customized-editable-grid-control) by removing the currency cell renderer logic.

```TypeScript
import { Label } from '@fluentui/react';
import * as React from 'react';
import { CellRendererOverrides } from '../types';

export const cellRendererOverrides: CellRendererOverrides = {
    ["Text"]: (props, col) => {
        // Render all text cells in green font
        return <Label style={{ color: 'green' }}>{props.formattedValue}</Label>
    }
}
```

### Build the Project
To build the project, start by installing the dependency packages:
```powershell
npm install
```

If you encounter missing type definitions, run the following script:
```powershell
npm run refreshTypes
```

Finally, build the project:
```powershell
npm run build
```

If the build process complains about missing lint configuration, use the `.eslintrc.json` configuration below:
```json
{
    "env": {
      "browser": true,
      "es2021": true
    },
    "extends": [
      "eslint:recommended"
    ],
    "globals": {
      "ComponentFramework": true,
      "JSX": "readonly"
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaVersion": 12,
      "sourceType": "module"
    },
    "plugins": [
      "@microsoft/power-apps",
      "@typescript-eslint"
    ],
    "rules": {
      "no-unused-vars": "off"
    }
}
```

If the lint validation fails due to an empty constructor, try delete the `node_modules` folder and reinstall the dependencies: 
```powershell
npm install
```

### Package Solutions for Deployment
To package your solution, first install the [Power Platform Tools VSCode extension](https://learn.microsoft.com/en-us/power-platform/developer/howto/install-vs-code-extension).

- Create a folder for hosting solution. Choose a meaningful name, as it will be used for the solution.

![image](../images/2024-07-19-enhancing-d365-with-customized-editable-grids/solution-folder.png)

Solution display name shown after imported into the target environment
![image](../images/2024-07-19-enhancing-d365-with-customized-editable-grids/solution-display-name.png)

- Initialize the solution project folder:
```powershell
pac solution init --publisher-name Samples --publisher-prefix samples
```
Reference: [Microsoft Documentation](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/implementing-controls-using-typescript?tabs=before)

- Add a reference to the PCF project folder, which should contain a `.pcfproj` file: 
```powershell
pac solution add-reference --path ..\ 
```
Note: you can reference multiple PCF project folders

- Generate the solution zip file using .NET 6 SDK. To do this, navigate to the `cdsproj` solution project directory and run:
```powershell
dotnet build 
```

### Implementing a Grid Customizer Control
To implement the grid customizer control, first import the package solution into the target environment. Then, follow the detailed steps in the [Microsoft documentation](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/customize-editable-grid-control#implementing-a-grid-customizer-control).

### Upgrade a Grid Customizer Control
If you make some updates to the grid control customizer, but the change didn't come through after deployment. Please try the following:
- Update the version in the ControlManifest.Input.xml file.
- Delete the solution and its component(s), re-import the solution.

### Final Result
![image](../images/2024-07-19-enhancing-d365-with-customized-editable-grids/grid-control-customizer-result.png)