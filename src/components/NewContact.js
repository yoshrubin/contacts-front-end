import React from 'react';
import '../contact.css';
import { Link, Redirect, withRouter } from 'react-router-dom';

class NewContact extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            title: '',
            phone: '',
            avatar: '',
            id: '',
            home: false,
            isNew: true,
            nameError: false,
            phoneError: false
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
    }

    handleNameChange(event) {
        event.target.value.length > 30 ? 
        this.setState({ nameError: true }) :
        this.setState({ name: event.target.value});
    }

    handleTitleChange(event) {
        this.setState({ title: event.target.value });
    }

    handlePhoneChange(event) {
        /[^\d-]/.test(event.target.value) ?
        this.setState({ phoneError: true }) :
        this.setState({ phone: event.target.value });
    }

    randomAvatar() {
        const min = 0;
        const max = 99;
        const random = Math.floor(Math.random() * (max - min + 1) + min);
        const gender = random%2===0 ? 'men' : 'women';
        const image = 'https://randomuser.me/api/portraits/'+ gender+'/'+random+'.jpg'
        this.setState({avatar: image })
    }

    componentDidMount() {
        let contact = this.props.location.contact ?? null;
        let paramdId = this.props.match.params['id'];
        if(!contact && paramdId){
            find({id: this.props.match.params['id']})
                .then(res => res.json())
                .then(contact => this.setState({ 
                    name: contact.name,
                    title: contact.title,
                    phone: contact.phone,
                    avatar: contact.avatar,
                    id: contact.id,
                 }));
        }  
        if(contact) {
            this.setState({ 
                name: contact.name,
                title: contact.title,
                phone: contact.phone,
                avatar: contact.avatar,
                id: contact.id,
                isNew: false
            });
        } else if (this.state.avatar === '') {
            this.randomAvatar();
        }
    }

    render() {
        let error;
        let nameError;
        let phoneError;
        const notExists = this.props.match.params['id'] && !this.state.id;
        if(this.state.home){
            return <Redirect to='/' />
        }
        if(this.state.nameError) {
            nameError = <div className="error">Name cannot be longer than 30 characters</div>;
        }
        if(this.state.phoneError) {
            phoneError = <div className="error">Phone can only contain numbers or dashes</div>;
        }
        if(notExists) {
            error = <div className="error">This contact does not exist</div>;
        }
        return (
            <div className="contact-container">
                <div className="new-contact-container">
                    <div className="new-contact-avatar">
                        <img 
                            src={this.state.avatar} 
                            alt="Avatar"  
                        />
                        <button>
                            <i 
                                className="fa fa-refresh" 
                                aria-hidden="true" 
                                onClick={() => this.randomAvatar()}
                                disabled={notExists}
                            ></i>
                        </button>
                        {error}
                    </div>
                    <div className="new-contact-inputs">
                        <div className="new-contact-input">
                            <label>Name</label>
                            <input 
                                type="text" 
                                value={this.state.name} 
                                onChange={this.handleNameChange} 
                                disabled={notExists}
                            />
                        </div>
                        {nameError}
                        <div className="new-contact-input">
                            <label>Phone</label>
                            <input 
                                type="text" 
                                value={this.state.phone} 
                                onChange={this.handlePhoneChange}
                                disabled={notExists}
                            />
                        </div>
                        {phoneError}
                        <div className="new-contact-input">
                            <label>Title</label>
                            <input 
                                type="text" 
                                value={this.state.title} 
                                onChange={this.handleTitleChange}
                                disabled={notExists}
                            />
                        </div>
                    </div>
                    <div className="new-contact-buttons">
                        <button className="button-ok" onClick={() => submit(this.state)
                            .then(() => this.setState({home: true}), error => console.log(error))}>
                            Save
                        </button>
                        <Link to="/">
                            <button className="button-cancel">Cancel</button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

function find(props) {
    return fetch('http://127.0.0.1:8000/api/contacts/'+props.id);
}

function submit(props) {
    return props.isNew ?
    fetch('http://127.0.0.1:8000/api/contacts', { 
        method: 'POST', 
        body: JSON.stringify(props), 
        headers: { 'Content-Type': 'application/json' } 
    }) :
    fetch('http://127.0.0.1:8000/api/contacts/'+props.id, {
        method: 'PUT',
        body: JSON.stringify(props),
        headers: { 'Content-Type': 'application/json' }
    });
}

export default withRouter(NewContact);