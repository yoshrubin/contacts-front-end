import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import './contact.css';
import NewContact from './components/NewContact'
// import { Provider } from 'react-redux'

class AddContactButtons extends React.Component {
    render() {
        return (
            <div className="contact-new">
                <Link to="/new">
                    <button>
                        <i className="fa fa-user-plus" aria-hidden="true"></i>
                    </button>
                </Link>
                <button>
                    <i className="fa fa-random random" aria-hidden="true"></i>
                </button>
            </div>
        )
    }
}

class Contact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="contact">
                <div className="contact-avatar">
                        <img src={this.props.avatar} alt="Avatar" />
                </div>
                <div className="contact-details">
                <Link to={{
                        pathname: "/contacts/"+this.props.id,
                        contact: { 
                            avatar: this.props.avatar,
                            name: this.props.name,
                            title: this.props.title,
                            phone: this.props.phone,
                            id: this.props.id,
                        }
                    }}>
                    <div className="contact-name">{this.props.title} {this.props.name}</div>
                    </Link>
                    <div className="contact-phone">{this.props.phone}</div>
                </div>
            
            <div className="contact-buttons">
                <button>
                    <i 
                        className="fa fa-phone" 
                        aria-hidden="true" 
                        onClick={() => call(this.props.phone)}
                    >
                    </i>
                </button>
            </div>
            <div className="contact-button-close">
                    <i 
                        className="fa fa-times" 
                        aria-hidden="true" 
                        onClick={ () => (window.confirm('Are you sure you want to delete this contact?')) ?
                            deleteContact(this.props.id)
                                .then(() => this.props.handleDelete(), error => console.log(error))
                            : ''
                        }
                    >
                    </i>
            </div>
        </div>
        );
    }
}

function call(phone) {
    if(window.confirm('Call ' + phone)){
        //phone call logic (tel:phone)
    }
}

function deleteContact(id){
    return fetch('https://contacts.test/api/contacts/'+id, { method: 'DELETE' });
}


class Search extends React.Component {
    render() {
        return (
            <div className="search-input">
                <input type="text" placeholder="search in contacts..." />
                <div className="search-icon">
                    <i className="fa fa-search" aria-hidden="true"></i>
                </div>
            </div>
        );
    }
}

class Contacts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: null,
            data: null,
            deleted: ''
        };

        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete(id) {
        let data = this.state.data;
        data.pop(data.findIndex(contact => contact.id === id));
        this.setState({ data: data });
    }

    componentDidMount(){
        fetch('https://contacts.test/api/contacts')
        .then(res => res.json())
            .then(contacts => this.setState({ contacts: contacts, data: contacts.data}), error => console.log(error))
    }

    render() {
        const { contacts } = this.state;
        return (
            // <Provider>
                <div className="contact-container">
                    <Search />
                    <div className="contacts-container">
                    { contacts ? (
                        contacts.data.map(contact => (
                            <Contact 
                                key={contact.id}
                                id={contact.id}
                                title={contact.title}
                                name={contact.name}  
                                phone={contact.phone}
                                avatar={contact.avatar}
                                handleDelete={() => this.handleDelete(contact.id)}
                            />
                        ))
                    ) : (
                        <div>Loading...</div>
                    )}
                    </div>
                    <AddContactButtons />
                </div>
            // {/* </Provider> */}
        );
    }
}

class Base extends React.Component {
    render() {
        return(
            <BrowserRouter>
                <Switch>
                    <Route exact path="/contacts">
                        <Contacts />
                    </Route>
                    <Route path="/contacts/:id">
                        <NewContact />
                    </Route>
                    <Route path="/new">
                        <NewContact />
                    </Route>
                    <Route path="/">
                        <Contacts />
                    </Route>
                </Switch>
            </BrowserRouter>
        );
    }
}

// ========================================

ReactDOM.render(
    <Base />,
    document.getElementById('root')
);
