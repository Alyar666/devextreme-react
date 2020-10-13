import * as React from 'react';
import { SelectBox } from '../src/select-box';

const SelectBoxItem = (option: any) => {
  return <span>{option.data.value}</span>;
};

class SelectBoxEditor extends React.Component {
  public render() {
    return (
      <SelectBox
        searchEnabled={true}
        showClearButton={true}
        searchTimeout={0}
        noDataText="No results found"
        displayExpr="label"
        valueExpr="value"
        items={items}
        itemComponent={SelectBoxItem}
      />
    );
  }
}

export default SelectBoxEditor;

const items = [
  {
    label: '1',
    value: '1',
  },
  {
    label: '2',
    value: '2',
  },
  {
    label: '3',
    value: '3',
  },
  {
    label: '4',
    value: '4',
  },
  {
    label: '5',
    value: '5',
  },
];
