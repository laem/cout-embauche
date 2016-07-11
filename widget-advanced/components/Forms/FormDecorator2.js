import React, { Component } from 'react'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Field} from 'redux-form'
import * as actions from '../../actions'

/*
This higher order component wraps "Form" components (e.g. Question.js), that represent user inputs,
with a header, click actions and more goodies.

Read https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
to understand those precious higher order components.
*/
export var FormDecorator2 = RenderField =>
	@connect( //... this helper directly to the redux state to avoid passing more props
		state => ({steps: state.steps}),
		dispatch => ({
			actions: bindActionCreators(actions, dispatch),
		})
	)
	class extends Component {
		state = {
			helpVisible: false,
		}
		render() {
			let {
				visible,
				name,
				steps,
				actions: {submitStep},
				variableName,
				serialise,
				valueType,
				valueIfIgnored,
				attributes,
				choices,
				optionsURL,
			} = this.props

			/* Call redux-form's handleSumbit to keep the form in state
			and trigger the SUMIT_STEP action that will mark this
			step in the state as completed.
			SUBMIT_STEP will also trigger an API call if specified in the props.
			The value can be serialised before being sent online,
			e.g. to transform a percentage to a ratio */
			serialise = serialise || valueType && new valueType().serialise
			let	submit = (value, ignored) => () => submitStep(name, variableName, value, serialise, ignored)

			let ignoreStep = submit(valueIfIgnored, true)
				// Renseigne automatiquement la valeur de la saisie
				//TODO field.onChange(valueIfIgnored)

			let
				/* La saisie peut être cachée car ce n'est pas encore son tour,
				ou parce qu'elle a déjà été remplie. Dans ce dernier cas, un résumé
				de la réponse est affiché */
				completed = steps.get(name),
				display =  visible && !completed

			if (!display) return null

			/* Nos propriétés personnalisées à envoyer au RenderField.
			Elles sont regroupées dans un objet précis pour pouvoir être enlevées des
			props passées à ce dernier, car React 15.2 n'aime pas les attributes inconnus
			des balises html, <input> dans notre cas.
			*/
			let stepProps = {
				attributes, /* For input html attributes */
				choices,  /* For radio choices */
				optionsURL, /* Data source for Select component */
				submit,
				valueType,
			}
			return (
				<section className="step">
					{this.state.helpVisible && this.renderHelpBox()}
					{this.renderQuestion()}
					{ valueIfIgnored &&
						<a className="ignore" onClick={ignoreStep}>
							passer
						</a>
					}
					<Field
						component={RenderField}
						name={name}
						stepProps={stepProps }
						/>
				</section>
			)
		}

		renderQuestion = () =>
				<span>
					<h1>{this.props.question}</h1>
					{this.props.helpText &&
						<span
						className="question-mark"
						onClick={() => this.setState({helpVisible: true})}>?</span>
					}
				</span>

		renderHelpBox = () =>
			<div className="help-box">
				<a
					className="close-help"
					onClick={() => this.setState({helpVisible: false})}>&#10005;</a>
				<p>{this.props.helpText}</p>
			</div>
	}
