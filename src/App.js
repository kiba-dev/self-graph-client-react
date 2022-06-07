import { useState } from 'react'
import { ApolloClient, gql, HttpLink, InMemoryCache } from 'apollo-boost'
import './App.css';

const endpointUrl = 'http://localhost:9000/graphql'
const client = new ApolloClient({
  link: new HttpLink({ uri: endpointUrl }),
  cache: new InMemoryCache()
})

function App() {
  const [greetingMessage, setGreetingMessage] = useState('')
  const [sayHelloMessage, setSayHelloMessage] = useState('')
  const [students, setStudents] = useState([])
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loadStudents = async () => {
    const query = gql`
    {
      students {
        id
        firstName,
        lastName,
        college {
          name
        }
      }
    }`

    const { data } = await client.query({ query })
    setStudents(data.students)
  }

  const loadGreeting = async () => {
    const response = await fetch('http://localhost:9000/graphql', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: '{test}' })
    })

    const res = await response.json()

    return res.data.test
  }

  const loadSayHello = async (name) => {
    const response = await fetch('http://localhost:9000/graphql', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: `{sayHello(name:"${name}")}` })
    })

    const res = await response.json()

    return res.data.sayHello
  }

  const updateName = (evt) => {
    setUserName(evt.target.value)
  }

  const showGreeting = () => {
    loadGreeting().then(message => {
      setGreetingMessage(message)
    })
  }

  const showSayHelloMessage = () => {
    loadSayHello(userName).then(message => {
      setSayHelloMessage(message)
    })
  }

  const updateEmail = (evt) => {
    setEmail(evt.target.value)
  }

  const updatePassword = (evt) => {
    setPassword(evt.target.value)
  }

  const handleLogin = async () => {
    const response = await fetch('http://localhost:9000/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const res = await response.json()

    console.log(res)
  }

  return (
    <div className="App">
      <div>
        <input type="button" value="loadStudents" onClick={loadStudents} />
        <div>
          <br />
          <hr />
          <table border="3">
            <thead>
              <tr>
                <td>First Name</td>
                <td>Last Name</td>
                <td>college Name</td>
              </tr>
            </thead>

            <tbody>
              {
                students.map(s => {
                  return (
                    <tr key={s.id}>
                      <td>
                        {s.firstName}
                      </td>
                      <td>
                        {s.lastName}
                      </td>
                      <td>
                        {s.college.name}
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
      <br /><br />
      <section>
        <button id="btnGreet" onClick={showGreeting}>Greet</button>
        <br /><br />
        <div id="greetingDiv">
          <h1>{greetingMessage}</h1>
        </div>
      </section>

      <hr />

      <section>
        Enter a name:<input id="txtName" type="text" onChange={updateName} value={userName} />
        <button id="btnSayhello" onClick={showSayHelloMessage}>SayHello</button>
        <br />
        user name is:{userName}
        <br />
        <div id="SayhelloDiv">
          <h1>{sayHelloMessage}</h1>
        </div>
      </section>

      <hr />

      <section>
        <h1>Login first to access greeting</h1>
        <input id="email" type="text" onChange={updateEmail} value={email} />
        <br />
        <input id="password" type="password" onChange={updatePassword} value={password} />
        <br />
        <button id="btnLogin" onClick={handleLogin}>Login</button>
      </section>
    </div>
  );
}

export default App;
