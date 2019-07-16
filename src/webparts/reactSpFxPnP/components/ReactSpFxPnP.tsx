import * as React from 'react';
import styles from './ReactSpFxPnP.module.scss';
import { IReactSpFxPnPProps } from './IReactSpFxPnPProps';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { TaxonomyPicker, IPickerTerms } from "@pnp/spfx-controls-react/lib/TaxonomyPicker";
import { PeoplePicker } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { IReactSpFxPnP } from "../Model/IReactSpFxPnP";
import { default as pnp, ItemAddResult } from "sp-pnp-js";
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/components/Button';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';


export default class ReactSpFxPnP extends React.Component<IReactSpFxPnPProps, IReactSpFxPnP> {
  constructor(prop) {
    super(prop);
    this.handleTitle = this.handleTitle.bind(this);
    this.handleDesc = this.handleDesc.bind(this);
    this._onCheckboxChange = this._onCheckboxChange.bind(this);
    this._onRenderFooterContent = this._onRenderFooterContent.bind(this);
    this.createItem = this.createItem.bind(this);
    this.onTaxPickerChange = this.onTaxPickerChange.bind(this);
    this._getManager = this._getManager.bind(this);
    this.state = {
      name:"",
      description:"",
      selectedItems: [],
      hideDialog: true,
      showPanel: false,
      dpselectedItem: undefined,
      dpselectedItems: [],  
      disableToggle:false,
      defaultChecked:false,
      termKey: undefined,
      userIDs: [],
      userManagerIDs: [],
      pplPickerType: "",
      status:"",
      isChecked: false,
      required:"Campo obrigatório",
      onSubmission:false,
      termnCond:false,
    };
  }

  public render(): React.ReactElement<IReactSpFxPnPProps> {
    const { dpselectedItem, dpselectedItems } = this.state;
    const { name, description } = this.state;
    pnp.setup({
      spfxContext: this.props.context
    });

    return (
      <form>
        <div className={styles.reactSpFxPnP}>
          <div className={styles.container}>
            <div className={`ms-Grid-row ms-bgColor-neutralLight ms-fontColor-white ${styles.row}`}>
              <div className="ms-Grid-col ms-u-sm4 block">
                <label className="ms-Label">Nome</label>
              </div>
              <div className="ms-Grid-col ms-u-sm8 block">
                <TextField value={this.state.name} required={true} onChanged={this.handleTitle}
                  errorMessage={(this.state.name.length === 0 && this.state.onSubmission === true) ? this.state.required : ""} />
              </div>
              <div className="ms-Grid-col ms-u-sm4 block">
                <label className="ms-Label">Descrição</label>
              </div>
              <div className="ms-Grid-col ms-u-sm8 block">
                <TextField multiline autoAdjustHeight value={this.state.description} onChanged={this.handleDesc}
                />
              </div>
              <div className="ms-Grid-col ms-u-sm4 block">
                <label className="ms-Label">Líder</label><br />
              </div>
              <div className="ms-Grid-col ms-u-sm8 block">
                <TaxonomyPicker
                  allowMultipleSelections={false}
                  termsetNameOrID="Lider"
                  panelTitle="Selecione o projeto.."
                  label=""
                  context={this.props.context}
                  onChange={this.onTaxPickerChange}
                  isTermSetSelectable={false}
                />
                <p className={(this.state.termKey === undefined && this.state.onSubmission === true) ? styles.fontRed : styles.hideElement}>Campo obrigatório</p>
              </div>
              <div className="ms-Grid-col ms-u-sm4 block">
                <label className="ms-Label">Cargo</label><br />
              </div>
              <div className="ms-Grid-col ms-u-sm8 block">
                <Dropdown
                  placeHolder="Selecione uma opção.."
                  label=""
                  id="component"
                  selectedKey={dpselectedItem ? dpselectedItem.key : undefined}
                  ariaLabel="Basic dropdown example"
                  options={[
                    { key: 'Analista de Sistemas', text: 'Analista de Sistemas' },
                    { key: 'Desenvolvedor', text: 'Desenvolvedor' },
                    { key: 'Arquiteto de Software', text: 'Arquiteto de Software' },
                    { key: 'Design', text: 'Design' }
                  ]}
                  onChanged={this._changeState}
                  onFocus={this._log('onFocus called')}
                  onBlur={this._log('onBlur called')}
                />
              </div>
              <div className="ms-Grid-col ms-u-sm4 block">
                <label className="ms-Label">Situação</label>
              </div>
              <div className="ms-Grid-col ms-u-sm8 block">
                <Toggle
                  disabled={this.state.disableToggle}
                  checked={this.state.defaultChecked}
                  label=""
                  onAriaLabel="This toggle is checked. Press to uncheck."
                  offAriaLabel="This toggle is unchecked. Press to check."
                  onText="Ativo"
                  offText="Inativo"
                  onChanged={(checked) => this._changeSharing(checked)}
                  onFocus={() => console.log('onFocus called')}
                  onBlur={() => console.log('onBlur called')}
                />
              </div>
              <div className="ms-Grid-col ms-u-sm4 block">
                <label className="ms-Label">Anotações adicionais</label>
              </div>
              <div className="ms-Grid-col ms-u-sm8 block">
                <PeoplePicker
                  context={this.props.context}
                  titleText=" "
                  personSelectionLimit={1}
                  groupName={""}
                  showtooltip={false}
                  isRequired={true}
                  disabled={false}
                  selectedItems={this._getManager}
                  // errorMessage={(this.state.userManagerIDs.length === 0 && this.state.onSubmission === true) ? this.state.required : " "}
                  // errorMessageclassName={styles.hideElementManager}
                />
              </div>
              <div className="ms-Grid-col ms-u-sm1 block">
                <Checkbox onChange={this._onCheckboxChange} ariaDescribedBy={'descriptionID'} />
              </div>
              <div className="ms-Grid-col ms-u-sm11 block">
                <span className={`${styles.customFont}`}>Eu li e concordo com os Termos e Condições</span><br />
                <p className={(this.state.termnCond === false && this.state.onSubmission === true) ? styles.fontRed : styles.hideElement}>Por favor aceite os Termos & Condições</p>
              </div>
              <div className="ms-Grid-col ms-u-sm6 block">
              </div>
              <div className="ms-Grid-col ms-u-sm2 block">
                <PrimaryButton text="Criar" onClick={() => { this.validateForm(); }} />
              </div>
              <div className="ms-Grid-col ms-u-sm2 block">
                <DefaultButton text="Cancelar" onClick={() => { this.setState({}); }} />
              </div>
              <div>
                <Panel
                  isOpen={this.state.showPanel}
                  type={PanelType.smallFixedFar}
                  onDismiss={this._onClosePanel}
                  isFooterAtBottom={false}
                  headerText="Deseja criar ?"
                  closeButtonAriaLabel="Close"
                  onRenderFooterContent={this._onRenderFooterContent}
                ><span>Por favor, verifique os detalhes preenchidos e clique no botão Confirmar.</span>
                </Panel>
              </div>
              <Dialog
                hidden={this.state.hideDialog}
                onDismiss={this._closeDialog}
                dialogContentProps={{
                  type: DialogType.largeHeader,
                  title: 'Cadastro realizado com sucesso',
                  subText: ""
                }}
                modalProps={{
                  titleAriaId: 'myLabelId',
                  subtitleAriaId: 'mySubTextId',
                  isBlocking: false,
                  containerClassName: 'ms-dialogMainOverride'
                }}>
                <div dangerouslySetInnerHTML={{ __html: this.state.status }} />
                <DialogFooter>
                  <PrimaryButton onClick={() => this.gotoHomePage()} text="Ok" />
                </DialogFooter>
              </Dialog>
            </div>
          </div>
        </div>
      </form>
    );
  }

  private onTaxPickerChange(terms: IPickerTerms) {
    this.setState({ termKey: terms[0].key.toString() });
    console.log("Terms", terms);
  }

  private _getManager(items: any[]) {
    this.state.userManagerIDs.length = 0;
    let tempuserMngArr = [];
    for (let item in items) {
      tempuserMngArr.push(items[item].id);
    }
    this.setState({ userManagerIDs: tempuserMngArr });
  }

  private _onRenderFooterContent = (): JSX.Element => {
    return (
      <div>
        <PrimaryButton onClick={this.createItem} style={{ marginRight: '8px' }}>
          Confirmar
      </PrimaryButton>
        <DefaultButton onClick={this._onClosePanel}>Cancelar</DefaultButton>
      </div>
    );
  }

  private _log(str: string): () => void {
    return (): void => {
      console.log(str);
    };
  }

  private _onClosePanel = () => {
    this.setState({ showPanel: false });
  }

  private _onShowPanel = () => {
    this.setState({ showPanel: true });
  }

  private _changeSharing(checked: any): void {
    this.setState({ defaultChecked: checked });
  }

  private _changeState = (item: IDropdownOption): void => {
    console.log('here is the things updating...' + item.key + ' ' + item.text + ' ' + item.selected);
    this.setState({ dpselectedItem: item });
    if (item.text == "Pessoas") {
      this.setState({ defaultChecked: false });
      this.setState({ disableToggle: true });
    }
    else {
      this.setState({ disableToggle: false });
    }
  }

  private handleTitle(value: string): void {
    return this.setState({
      name: value
    });
  }

  private handleDesc(value: string): void {
    return this.setState({
      description: value
    });
  }

  private _onCheckboxChange(ev: React.FormEvent<HTMLElement>, isChecked: boolean): void {
    console.log(`The option has been changed to ${isChecked}.`);
    this.setState({ termnCond: (isChecked) ? true : false });
  }

  private _closeDialog = (): void => {
    this.setState({ hideDialog: true });
  }

  private _showDialog = (status: string): void => {
    this.setState({ hideDialog: false });
    this.setState({ status: status });
  }

  private validateForm(): void {
    let allowCreate: boolean = true;
    this.setState({ onSubmission: true });

    if (this.state.name.length === 0) {
      allowCreate = false;
    }
    if (this.state.termKey === undefined) {
      allowCreate = false;
    }

    if (allowCreate) {
      this._onShowPanel();
    }
    else {
      
    }
  }

  private createItem(): void {
    this._onClosePanel();
    this._showDialog("Enviando solicitação..");
    pnp.sp.web.lists.getByTitle("Pessoas").items.add({
      Titulo: document.getElementById('Title'["value"]),
      Descricao: document.getElementById('Descrição')["value"],
      Lider: {
        __metadata: { "type": "SP.Taxonomy.TaxonomyFieldValue" },
        Label: "1",
        TermGuid: document.getElementById('Lider')["value"],
        WssId: -1
      },
      Cargo: document.getElementById('Cargo')["value"],
      Reporting_x0020_ManagerId: this.state.userManagerIDs[0]
    }).then((iar: ItemAddResult) => {
      console.log(iar);
      this.setState({ status: "Sua solicitação foi enviada com sucesso." });
    });
  }

  private gotoHomePage(): void {
    window.location.replace(this.props.siteUrl);
  }
}


