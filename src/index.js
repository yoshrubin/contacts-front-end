import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import './contact.css';
import NewContact from './components/NewContact'
// import { Provider } from 'react-redux'

class AddContactButtons extends React.Component {

    createRandom() {
        fetch('https://randomuser.me/api/')
            .then(res => res.json())
            .then(contact => {
                let user = contact.results[0]
                let randomContact = {
                    key: contact.info.seed,
                    id: contact.info.seed,
                    name: user.name.first + ' ' + user.name.last,
                    title: user.name.title,
                    phone: user.phone,
                    avatar: user.picture.large
                };
                this.props.handleCreateRandomContact(randomContact);
            });
    }

    render() {
        return (
            <div className="contact-new">
                <Link to="/new">
                    <button>
                        <i className="fa fa-user-plus" aria-hidden="true"></i>
                    </button>
                </Link>
                <button>
                    <i className="fa fa-random random" aria-hidden="true" onClick={() => this.createRandom()}></i>
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
    constructor(props) {
        super(props);
        this.state = {
            search: ''
        }
        this.handleSearch = this.handleSearch.bind(this);
    }
    handleSearch(event) {
        this.setState({ search: event.target.value });
        this.props.search(event.target.value);
    }
    render() {
        return (
            <div className="search-input">
                <input 
                    value={this.state.search} 
                    onChange={this.handleSearch} 
                    type="text" 
                    placeholder="search in contacts..." 
                />
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

        this.handleSearch = this.handleSearch.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleCreateRandomContact = this.handleCreateRandomContact.bind(this);
    }

    handleSearch(searchParams) {
        console.log(searchParams);
        let data = this.state.contacts.data;
        let filtered = data.filter(contact => contact.name.includes(searchParams));
        this.setState({ data: filtered });
    }

    handleDelete(id) {
        let data = this.state.data;
        data.pop(data.findIndex(contact => contact.id === id));
        this.setState({ data: data });
    }

    handleCreateRandomContact(contact) {
        let data = this.state.data;
        data.push(contact);
        this.setState({ data: data });
        submit(contact);
    }

    componentDidMount(){
        fetch('http://127.0.0.1:8000/api/contacts')
        .then(res => res.json())
            .then(contacts => this.setState({ contacts: contacts, data: contacts.data}), error => console.log(error))
    }

    render() {
        const { data } = this.state;
        return (
            // <Provider>
                <div className="contact-container">
                    <Search search={this.handleSearch} />
                    <div className="contacts-container">
                    { data ? (
                        data.map(contact => (
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
                    <AddContactButtons handleCreateRandomContact={this.handleCreateRandomContact}/>
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

function submit(props) {
    return fetch('http://127.0.0.1:8000/api/contacts', {
        method: 'POST',
        body: JSON.stringify(props),
        headers: { 'Content-Type': 'application/json' }
    });
}

// ========================================

ReactDOM.render(
    <Base />,
    document.getElementById('root')
);
