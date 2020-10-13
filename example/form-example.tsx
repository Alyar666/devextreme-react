import * as React from "react";
import Example from "./example-block";

import { Button, NumberBox } from "../src";
import Form, { GroupItem, Item, RequiredRule, SimpleItem, } from "../src/form";
import TextArea from "../src/text-area";

const employee: any = {
  ID: 1,
  FirstName: "John",
  LastName: "Heart",
  Position: "CEO",
  BirthDate: "1964/03/16",
  HireDate: "1995/01/15",
  Notes: "John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.",
  Address: "351 S Hill St., Los Angeles, CA",
  Phone: "360-684-1334"
};

const positions = [
  "HR Manager",
  "IT Manager",
  "CEO",
  "Controller",
  "Sales Manager",
  "Support Manager",
  "Shipping Manager"
];

export default class extends React.Component<any, {disableIdInput: boolean}> {
  constructor(props: any) {
    super(props);

    this.state = {
      disableIdInput: true
    };
  }

  public render() {
    const { disableIdInput } = this.state;
    return (
      <Example title="DxForm">
        <Form colCount={2} formData={employee}>
          <GroupItem caption="Form Group Item">
            <Item dataField="ID" component={getTextBoxComponent(disableIdInput)} />
            <Item>
              <Button
                text={disableIdInput ? "Enable input" : "Disable input"}
                onClick={this.toggleIdInputState}
              />
            </Item>
          </GroupItem>
          <SimpleItem dataField="FirstName" editorOptions={{ disabled: true }} />
          <SimpleItem dataField="LastName" editorOptions={{ disabled: true }} />
          <SimpleItem
            dataField="Position"
            editorType="dxSelectBox"
            editorOptions={{ items: positions, value: "" }}
          >
            <RequiredRule message="Position is required" />
          </SimpleItem>
          <SimpleItem
            dataField="BirthDate"
            editorType="dxDateBox"
            editorOptions={{ disabled: true, width: "100%" }}
          />
          <SimpleItem
            dataField="HireDate"
            editorType="dxDateBox"
            editorOptions={{ value: null, width: "100%" }}
          >
            <RequiredRule message="Hire date is required" />
          </SimpleItem>
          <SimpleItem
            dataField="Notes"
            colSpan={2}
          >
            <TextArea />
          </SimpleItem>
          <SimpleItem dataField="Address" />
          <SimpleItem
            dataField="Phone"
            editorOptions={{ mask: "+1 (X00) 000-0000", maskRules: { X: /[02-9]/ } }}
          />
        </Form>
      </Example>
    );
  }

  private toggleIdInputState = () => this.setState({ disableIdInput: !this.state.disableIdInput });
}

const getTextBoxComponent = (disabled: boolean) => (props: any) => {
  return <NumberBox disabled={disabled} value={props.data.editorOptions.value} />;
};
