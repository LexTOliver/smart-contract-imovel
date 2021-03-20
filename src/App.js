import React, {
	Component
} from 'react';
import Web3 from 'web3'
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';
import './css/App.css';


class App extends Component {

	constructor(props) {
		super(props)
		this.state = {
			status: "",
			loading: "none",
			carteiraAtiva: 0,
			senhaCompra: "senha",
			valorAnuncio: 0,
			anuncios: []
		}
	}


	componentDidMount() {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			window.ethereum.enable();
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider);
		}

		window.contract = new window.web3.eth.Contract([
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "address",
						"name": "vendedor",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "_idAnuncio",
						"type": "uint256"
					}
				],
				"name": "Abortado",
				"type": "event"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					}
				],
				"name": "abortar",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_valorImovel",
						"type": "uint256"
					}
				],
				"name": "anunciar",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "anuncioID",
						"type": "uint256"
					}
				],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "uint256[]",
						"name": "",
						"type": "uint256[]"
					}
				],
				"name": "AnunciosAtivos",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "address",
						"name": "comprador",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "_idAnuncio",
						"type": "uint256"
					}
				],
				"name": "CompraConfirmada",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "_idAnuncio",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "address",
						"name": "comprador",
						"type": "address"
					}
				],
				"name": "CompradorReembolsado",
				"type": "event"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "_safeHash",
						"type": "string"
					}
				],
				"name": "comprar",
				"outputs": [],
				"stateMutability": "payable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "key",
						"type": "string"
					}
				],
				"name": "confirmarRecebimento",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "_idAnuncio",
						"type": "uint256"
					}
				],
				"name": "ItemRecebido",
				"type": "event"
			},
			{
				"inputs": [],
				"name": "listarAnuncios",
				"outputs": [
					{
						"internalType": "uint256[]",
						"name": "",
						"type": "uint256[]"
					}
				],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "address",
						"name": "vendedor",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "_valorImovel",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "_idAnuncio",
						"type": "uint256"
					}
				],
				"name": "NovoAnuncio",
				"type": "event"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "key",
						"type": "string"
					}
				],
				"name": "pedirReembolso",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "Anuncios",
				"outputs": [
					{
						"internalType": "address payable",
						"name": "vendedor",
						"type": "address"
					},
					{
						"internalType": "address payable",
						"name": "comprador",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "valorImovel",
						"type": "uint256"
					},
					{
						"internalType": "bytes32",
						"name": "safeHash",
						"type": "bytes32"
					},
					{
						"internalType": "enum Venda_imovel.Estado",
						"name": "estado",
						"type": "uint8"
					}
				],
				"stateMutability": "view",
				"type": "function"
			}
		], '0xd21E51b10aFC1C9905d594564d43cC5f37Ec741A');

		//Carregar dados do contrato
		this.getCurrentAccount();
		this.carregarAnuncios();
	}

	//Funções do contrato

	getAnunciosId = async () => {

		const la = await window.contract.methods.listarAnuncios().call().then((response) => { return response })
		return la;
	}

	carregarAnuncios = async () => {
		try {
			this.setState({ loading: "block" });
			const s = await this.getAnunciosId();
			this.setState({ anuncios: [] });
			for (let item = 0; item < s.length; item++) {

				await window.contract.methods.Anuncios(s[item]).call()
					.then((response) => {
						let obj = {
							id: parseInt(s[item]),
							vendedor: response.vendedor,
							comprador: response.comprador,
							valorImovel: response.valorImovel,
							estado: response.estado,
						};

						let lista = this.state.anuncios;
						lista.push(obj);
						this.setState({ anuncios: lista });
					});
			}

		} catch (e) {
			console.log("Falha ao carregar anúncios.");
		} finally {
			this.setState({ loading: "none" });
		}
	}

	anunciar = async () => {

		this.setState({ loading: "block" });
		let weiValue = window.web3.utils.toWei(this.state.valorAnuncio.toString(), "ether");
		await this.getCurrentAccount();

		try{
			const idAnuncio = await window.contract.methods.anunciar(weiValue).send({
				from: this.state.carteiraAtiva
			}).then(
				(response) => {
					const obj = response.events.NovoAnuncio.returnValues;
					return obj._idAnuncio;
	
				}
			);
			this.carregarAnuncios();
			alert(`id: ${idAnuncio} \nValor do imovel : ${this.state.valorAnuncio}`);			
		}catch(error){
			alert('Falha ao validar transação (Anunciar) na rede blockchain!');
		}finally{
			this.setState({ loading: "none" });
		}

	}

	abortar = async (_idAnuncio) => {
		this.setState({ loading: "block" });
		await this.getCurrentAccount();
		try{
			const idAnuncio = await window.contract.methods.abortar(_idAnuncio).send({
				from: this.state.carteiraAtiva
			}).then(
	
				(response) => {
					const obj = response.events.Abortado.returnValues;
					return obj._idAnuncio;
	
				}
			);
			this.carregarAnuncios();
			alert(`Abortado. id: ${idAnuncio}`);
		}catch(erro){
			alert("Falha ao validar transação (Abortar) na rede blockchain!");
		}finally{
			this.setState({ loading: "none" });
		}

	}

	comprar = async (anuncio, senha) => {
		this.setState({ loading: "block" });
		await this.getCurrentAccount();
		let idAnuncio;
		try{
			idAnuncio = await window.contract.methods.comprar(anuncio.id, this.state.senhaCompra).send({
				from: this.state.carteiraAtiva,
				value: anuncio.valorImovel
			}).then(
	
				(response) => {
					const obj = response.events.CompraConfirmada.returnValues;
					return obj._idAnuncio;
	
				}
				);
				this.carregarAnuncios();
				alert(`Transação de compra em andamento. Confirme o recebimento. id: ${idAnuncio}`);
		}catch(error){
			alert('Falha ao validar transação (Comprar) na rede blockchain!');
		}finally{
			this.setState({ loading: "none" });
		}
	}

	confirmarRecebimento = async (anuncio, senha) => {
		this.setState({ loading: "block" });
		await this.getCurrentAccount();
		try{
			const idAnuncio = await window.contract.methods.confirmarRecebimento(anuncio.id, this.state.senhaCompra).send({
				from: this.state.carteiraAtiva
			}).then(
	
				(response) => {
					const obj = response.events.ItemRecebido.returnValues;
					return obj._idAnuncio;
	
				}
			);
			this.carregarAnuncios();
			alert(`Compra confirmada. id: ${idAnuncio}`);
		}catch(erro){
			alert("Falha ao validar transação (confirmarRecebimento) na rede blockchain!");
		}finally{
			this.setState({ loading: "none" });
		}
	}

	pedirReembolso = async (anuncio, senha) => {
		this.setState({ loading: "block" });
		console.log('id: ', anuncio.id);
		await this.getCurrentAccount();
		try{
			const idAnuncio = await window.contract.methods.pedirReembolso(anuncio.id, this.state.senhaCompra).send({
				from: this.state.carteiraAtiva
			}).then(
	
				(response) => {
					const obj = response.events.CompradorReembolsado.returnValues;
					return obj._idAnuncio;
	
				}
			);
			this.carregarAnuncios();
			alert(`Pedido de reembolso confirmado. id: ${idAnuncio}`);
		}catch(erro){
			alert('Falha ao validar transação (Anunciar) na rede blockchain!');
		}finally{
			this.setState({ loading: "none" });
		}
	}


	getCurrentAccount = async () => {
		try{
			const account = await window.web3.eth.getAccounts()
				.then((response) => { this.setState({ carteiraAtiva: response[0].toString() }); console.log('cartAtv: ', this.state.carteiraAtiva); return response[0].toString(); })
			return account;
		}catch(erro){
			alert('Não foi possível identificar uma carteira ativa. Por favor, realize o login no MetaMask');
		}
	}

	render() {
		return (
			< div >
				<div className="App-header">
					<h1>Venda de imóveis</h1>
				</div>
				<div>
					<TabView>
						<TabPanel header="Anunciar Imóvel">
							<div>
								<ProgressSpinner style={{ width: '50px', height: '50px', display: this.state.loading }} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" />
								<label>Valor do Imóvel (ETH)</label><br />
								<InputNumber value={this.state.valorAnuncio} onValueChange={(e) => { this.setState({ valorAnuncio: e.target.value }) }} showButtons buttonLayout="horizontal"
									decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" mode="decimal" minFractionDigits={7} />
								<Button label="Anunciar Imóvel" style={{ marginLeft: "25px" }} className="p-button-raised p-button-rounded p-button-secondary" onClick={() => this.anunciar()} />

							</div>
						</TabPanel>
						<TabPanel header="Comprar Imóvel">
							<div>
								<ProgressSpinner style={{ width: '50px', height: '50px', display: this.state.loading }} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" />

								{this.state.anuncios.filter((elem, index, arr) => elem.estado === "1").map(anuncio => <ul key={anuncio.id}>
									<img src="./imovel.jpg" alt="some text" width="150" />
									<Button label="Comprar" style={{ marginLeft: "25px", marginBottom: "15px" }} disabled={anuncio.vendedor === this.state.carteiraAtiva} className="p-button-raised p-button-rounded p-button-success" onClick={() => this.comprar(anuncio, this.state.senhaCompra)} /> <br />
									Vendedor: {anuncio.vendedor} <br />
									Valor: {anuncio.valorImovel}

								</ul>)}

							</div>
						</TabPanel>
						<TabPanel header="Minhas Operações">
							<div>
								<ProgressSpinner style={{ width: '50px', height: '50px', display: this.state.loading }} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" />
								{this.state.anuncios.filter((elem, index, arr) => (elem.vendedor === this.state.carteiraAtiva || elem.comprador === this.state.carteiraAtiva) && elem.estado !== "3" ).map(anuncio => <ul key={anuncio.id}>
									<img src="./imovel.jpg" alt="some text" width="150" /><br />
									<div style={{ marginTop: "5px", marginBottom: "5px" }} >
										<Button style={anuncio.estado === "1" && anuncio.vendedor === this.state.carteiraAtiva ? {} : { display: "none" }} label="Cancelar Anúncio" className="{} p-button-raised p-button-rounded p-button-danger" onClick={() => this.abortar(anuncio.id)} />
									</div>
									<div style={{ marginTop: "5px", marginBottom: "5px" }}>
										<Button style={((anuncio.estado === "2") && (anuncio.comprador === this.state.carteiraAtiva)) ? {} : { display: "none" }} label="Pedir Reembolso" className="p-button-raised p-button-rounded p-button-warning" onClick={() => this.pedirReembolso(anuncio, this.state.senhaCompra)} />
									</div>
									<div style={{ marginTop: "5px", marginBottom: "5px" }}>
										<Button style={anuncio.estado === "2" ? {} : { display: "none" }} label="Confirmar Recebimento" className="p-button-raised p-button-rounded " onClick={() => this.confirmarRecebimento(anuncio, this.state.senhaCompra)} /> <br />
									</div>
									Vendedor: {anuncio.vendedor} <br />
									Valor: {anuncio.valorImovel}

								</ul>)}
							</div>
						</TabPanel>
						<TabPanel header="Histórico">
							<div>
								<ProgressSpinner style={{ width: '50px', height: '50px', display: this.state.loading }} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" />

								{this.state.anuncios.filter((elem, index, arr) => elem.estado === "3").map(anuncio => <ul key={anuncio.id}>
									<img src="./imovel.jpg" alt="some text" width="150" />
									Vendedor: {anuncio.vendedor} <br />
									Comprador: { anuncio.comprador} <br />
									Valor: {anuncio.valorImovel}
								</ul>)}
							</div>
						</TabPanel>
					</TabView>

				</div >

			</div >

		);
	}
}
export default App;