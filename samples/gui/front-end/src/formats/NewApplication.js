import React, { useState } from 'react'
import { Button, Icon, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Form, Divider } from 'semantic-ui-react'

const NewApplication = props => {
  const [st, setState] = useState({ valid_label: false, valid_app_name: false, unique_app_name: true, color: 'green', message: 'Please enter a name' })
  const [application, setApplication] = useState({ geography: props.location.state.applications.geography, metadata: { name: '' }, spec: { selector: { matchLabels: ''}} })

  const handleNameChange = event => {
    const { name, value } = event.target
    const is_unique_app_name = !(props.location.state.applications.map(p => p.metadata.name !== value).includes(false))
    const is_valid_app_name = is_unique_app_name && (value.length > 0)
    const color = is_unique_app_name ? 'green' : 'red'
    const message = !is_unique_app_name ? 'Please enter unique name' : 'Please enter a name'
    setState({ ...st, valid_app_name: is_valid_app_name, unique_app_name: is_unique_app_name, color: color, message: message })
    setApplication({ ...application, metadata: { ...application.metadata, [name]: value } })
  }

  const handleLabelChange = event => {
    const { name, value } = event.target
    setState({ ...st, valid_label: value.length > 0 })
    // set labels
    setApplication({...application, spec: {...application.spec, selector: { ...application.spec.selector, [name]: value } } })
  }

  return (
    <Form>
      
      <Divider hidden />

      <Form.Field required error={!st.unique_app_name}>
        <label >Application instance name</label>
        <input placeholder='enter unique application instance name' autoComplete='off' name='name' value={application.metadata.name} onChange={handleNameChange} />
        <Label basic color={st.color} pointing>{st.message}</Label>
      </Form.Field>

      <Divider hidden />

      <Form.Field required>
        <label >Workload selector</label>
        <input placeholder='enter selector label' autoComplete='off' name='matchLabels' value={application.spec.selector.matchLabels} onChange={handleLabelChange} />
      </Form.Field>

      <Divider hidden />

      <Button icon labelPosition='left' as={Link} to="/" color='red'>
        <Icon name='left arrow' />Back
      </Button>
      <Link style={{ pointerEvents: st.valid_app_name && st.valid_label ? 'auto' : 'none' }} to={{ pathname: '/credentials', state: { application: application } }} >
        <Button icon labelPosition='right' disabled={!st.valid_app_name || !st.valid_label} color='green'>
          <Icon name='right arrow' />Next
        </Button>
      </Link>
    </Form>
  )
}

export default NewApplication
