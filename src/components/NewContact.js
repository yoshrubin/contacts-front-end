import React from 'react';
import '../contact.css';
import { Link, Redirect } from 'react-router-dom';

export default class NewContact extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            title: '',
            phone: '',
            avatar: '/images/User-icon.png'
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleAvatarChange = this.handleAvatarChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
    }

    handleNameChange(event) {
        this.setState({ name: event.target.value});
    }

    handleTitleChange(event) {
        this.setState({ title: event.target.value });
    }

    handleAvatarChange(event) {
        this.setState({ avatar: event.target.value });
    }

    handlePhoneChange(event) {
        this.setState({ phone: event.target.value });
    }

    render() {
        return (
            <div className="contact-container">
                <div className="new-contact-container">
                    <div className="new-contact-avatar">
                        <img 
                            value={this.state.avatar} 
                            src={this.state.avatar} 
                            alt="Avatar" 
                            onChange={this.handleAvatarChange}    
                        />
                        <button><i className="fa fa-refresh" aria-hidden="true"></i></button>
                    </div>
                    <div className="new-contact-inputs">
                        <div className="new-contact-input">
                            <label>Name</label>
                            <input type="text" value={this.state.name} onChange={this.handleNameChange}/>
                        </div>
                        <div className="new-contact-input">
                            <label>Phone</label>
                            <input type="text" value={this.state.phone} onChange={this.handlePhoneChange}/>
                        </div>
                        <div className="new-contact-input">
                            <label>Title</label>
                            <input type="text" value={this.state.title} onChange={this.handleTitleChange}/>
                        </div>
                    </div>
                    <div className="new-contact-buttons">
                        <button className="button-ok" onClick={() => submit(this.state)}>Save</button>
                        <Link to="/">
                            <button className="button-cancel">Cancel</button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

function submit(props) {
    fetch('https://contacts.test/api/contacts', { 
        method: 'POST', 
        body: JSON.stringify(props), 
        headers: { 'Content-Type': 'application/json' } 
    })
        .then(() => <Redirect to="/" />, console.log('error'));
}