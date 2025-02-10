import './index.scss';
import svg from './toolbox-icon.svg';

export default class AnyButton {
	/** @type {{[key: string]: HTMLElement | null}} **/
	nodes = {};

	/**
	 *
	 * @returns {{icon: string, title: string}}
	 */
	static get toolbox() {
		return {
			title: 'Button',
			icon: svg
		};
	}

	/**
	 * Returns true to notify the core that read-only mode is supported
	 *
	 * @return {boolean}
	 */
	static get isReadOnlySupported() {
		return true;
	}

	/**
	 *
	 * @returns {boolean}
	 */
	static get enableLineBreaks() {
		return false;
	}

	/**
	 *
	 * @param data
	 */
	set data(data) {
		this._data = Object.assign({}, {
			link: this.api.sanitizer.clean(data.link || '', AnyButton.sanitize),
			text: data.text || ''
		});
	}

	/**
	 *
	 * @returns {{text: string, link: string}}
	 */
	get data() {
		return this._data;
	}

	/**
	 * @returns {boolean}
	 */
	validate() {
		return !(this._data.link === '' || this._data.text === '');
	}

	/**
	 *
	 * @returns {{link: string, text: string}}
	 */
	save() {
		return this._data;
	}

	/**
	 * @returns {{link: boolean, text: boolean}}
	 */
	static get sanitize() {
		return {
			text: true,
			link: false
		};
	}

	defaultLinkValidation(text) {
		try {
			new URL(text);
		} catch (e) {
			return false;
		}
		return true;
	}

	defaultTextValidation(text) {
		return text !== '';

	}

	/**
	 *
	 * @param data
	 * @param config
	 * @param api
	 * @param readOnly
	 */
	constructor({data, config, api, readOnly}) {
		this.api = api;
		this.readOnly = readOnly;

		this.nodes = {
			wrapper: null,
			container: null,
			inputHolder: null,
			toggleHolder: null,
			anyButtonHolder: null,
			textInput: null,
			linkInput: null,
			registButton: null,
			anyButton: null
		};
		//css overwrite
		const _CSS = {
			baseClass: this.api.styles.block,
			hide: 'hide',
			btn: 'anyButton__btn',
			container: 'anyButtonContainer',
			input: 'anyButtonContainer__input',

			inputHolder: 'anyButtonContainer__inputHolder',
			inputText: 'anyButtonContainer__input--text',
			inputLink: 'anyButtonContainer__input--link',
			registButton: 'anyButtonContainer__registerButton',
			anyButtonHolder: 'anyButtonContainer__anyButtonHolder',
			btnColor: 'anyButton__btn--default'
		};

		this.CSS = Object.assign(_CSS, config.css);
		this.linkValidation = config.linkValidation || this.defaultLinkValidation.bind(this);
		this.textValidation = config.textValidation || this.defaultTextValidation.bind(this);

		this.data = {
			link: '',
			text: ''
		};
		this.data = data;

	}

	render() {
		this.nodes.wrapper = this.make('div', this.CSS.baseClass);
		this.nodes.container = this.make('div', this.CSS.container); //twitter-embed-tool

		this.nodes.inputHolder = this.makeInputHolder();

		this.nodes.container.appendChild(this.nodes.inputHolder);

		if (this._data.link !== '') {
			this.init();
		}

		this.nodes.wrapper.appendChild(this.nodes.container);

		return this.nodes.wrapper;
	}


	makeInputHolder() {
		const inputHolder = this.make('div', [this.CSS.inputHolder]);
		this.nodes.textInput = this.make('div', [this.api.styles.input, this.CSS.input, this.CSS.inputText], {
			contentEditable: !this.readOnly
		});
		this.nodes.textInput.dataset.placeholder = this.api.i18n.t('Button Text');

		this.nodes.linkInput = this.make('input', [this.api.styles.input, this.CSS.input, this.CSS.inputLink], {
			type: "text",
			required: true
		});
		this.nodes.linkInput.dataset.placeholder = this.api.i18n.t('Link Url');

		this.nodes.linkInput.addEventListener('input', () => {
			this.data = { ...this.data, 'link': this.nodes.linkInput.value};
		})

		this.nodes.textInput.addEventListener('input', () => {
			this.data = { ...this.data, 'text': this.nodes.textInput.innerHTML};
		})

		inputHolder.appendChild(this.nodes.textInput);
		inputHolder.appendChild(this.nodes.linkInput);

		return inputHolder;
	}

	init() {
		this.nodes.textInput.innerHTML = this._data.text;
		this.nodes.linkInput.value = this._data.link;
	}

	/**
	 * node 作成用
	 * @param tagName
	 * @param classNames
	 * @param attributes
	 * @returns {*}
	 */
	make(tagName, classNames = null, attributes = {}) {
		const el = document.createElement(tagName);

		if (Array.isArray(classNames)) {
			el.classList.add(...classNames);
		} else if (classNames) {
			el.classList.add(classNames);
		}

		for (const attrName in attributes) {
			el[attrName] = attributes[attrName];
		}

		return el;
	}
}