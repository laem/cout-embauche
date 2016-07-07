import React, { Component } from 'react'
import { formValueSelector } from 'redux-form'
import {connect} from 'react-redux'
import Summary from '../components/Summary'
import Details from '../components/Details'
import {toggleSection} from '../actions'
console.log(toggleSection)
let fmt = new Intl.NumberFormat('fr-FR').format

let selector = formValueSelector('basicInput')
@connect(state => ({
	typeEntreprise: selector(state, 'typeEntreprise'),
	typeSalaireEntré: selector(state, 'typeSalaireEntré'),
	results: state.results,
}), dispatch => ({
	toggleSection: () => dispatch(toggleSection()),
}))
export default class Results extends Component {
	render() {
		return (
			<div>
				<Summary {...this.props} humanizeFigures={this.humanizeFigures(0)}/>
				{this.props.showDetails &&
					<Details results={this.props.results} humanizeFigures={this.humanizeFigures(2)} />
				}
			</div>
		)
	}
	humanizeFigures = decimalDigits => value => fmt(value.toFixed(decimalDigits))

}
