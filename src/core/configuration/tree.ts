import { IConfigNode, ITemplate } from './config-node';
import { mergeNameParts, parseOptionName } from './utils';

interface IConfig {
  options: Record<string, any>;
  templates: Record<string, ITemplate>;
}

function buildConfig(root: IConfigNode, ignoreInitialValues: boolean): IConfig {
  const templatesAccum: Record<string, ITemplate> = {};
  const options = buildNode(root, templatesAccum, ignoreInitialValues);

  return {
    templates: templatesAccum,
    options,
  };
}

function buildNode(
  node: IConfigNode,
  templatesAccum: Record<string, ITemplate>,
  ignoreInitialValues: boolean,
): Record<string, any> {
  const result: Record<string, any> = {};

  Object.keys(node.predefinedOptions).forEach((key) => {
    result[key] = node.predefinedOptions[key];
  });

  Object.keys(node.configs).forEach((key) => {
    result[key] = buildNode(node.configs[key], templatesAccum, ignoreInitialValues);
  });

  Object.keys(node.configCollections).forEach((key) => {
    result[key] = node.configCollections[key].map(
      (item) => buildNode(item, templatesAccum, ignoreInitialValues),
    );
  });

  if (!ignoreInitialValues) {
    Object.keys(node.initialOptions).forEach((key) => {
      result[key] = node.initialOptions[key];
    });
  }

  Object.keys(node.options).forEach((key) => {
    result[key] = node.options[key];
  });

  buildTemplates(node, result, templatesAccum);

  return result;
}

function buildTemplates(
  node: IConfigNode,
  optionsAccum: Record<string, any>,
  templatesAccum: Record<string, ITemplate>,
): void {
  node.templates.forEach(
    (template) => {
      if (template.isAnonymous) {
        const templateName = mergeNameParts(node.fullName, template.optionName);
        optionsAccum[template.optionName] = templateName;
        templatesAccum[templateName] = template;
      } else {
        templatesAccum[template.optionName] = template;
      }
    },
  );
}

interface IValueDescriptor {
  value: any;
  type: ValueType;
}

enum ValueType {
  Simple,
  Complex,
  Array
}

function findValue(node: IConfigNode, path: string[]): undefined | IValueDescriptor {
  const name = path.shift();

  if (!name) {
    return {
      value: buildConfig(node, true).options,
      type: ValueType.Complex,
    };
  }

  const optionInfo = parseOptionName(name);
  if (optionInfo.isCollectionItem) {
    const collection = node.configCollections[optionInfo.name];
    if (!collection) {
      return undefined;
    }

    const item = collection[optionInfo.index];
    if (!item) {
      return undefined;
    }

    return findValue(item, path);
  }

  const child = node.configs[optionInfo.name];
  if (child) {
    return findValue(child, path);
  }

  const childCollection = node.configCollections[optionInfo.name];
  if (childCollection) {
    if (path.length !== 0) {
      return undefined;
    }

    return {
      value: childCollection.map((item) => buildNode(item, {}, true)),
      type: ValueType.Array,
    };
  }

  if (optionInfo.name in node.options) {
    return findValueInObject(node.options[optionInfo.name], path);
  }
  return undefined;
}

function findValueInObject(obj: any, path: string[]): undefined | IValueDescriptor {
  if (obj === null || obj === undefined) {
    return undefined;
  }

  const key = path.shift();
  if (!key) {
    return {
      value: obj,
      type: ValueType.Simple,
    };
  }

  return findValueInObject(obj[key], path);
}

export {
  ValueType,
  buildConfig,
  buildNode,
  buildTemplates,
  findValue,
};
