import {useState} from 'react';
import api from '../api';
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../constants';
import {useNavigate} from 'react-router-dom';
import '../styles/Form.css';
import LoadingIndicator from './LoadingIndicator.jsx'; 

function Form({ route, method }) {
    const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "LOGIN" : "REGISTER";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, { username, password })
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    };

    return (
		<div className='form-container'>
	        <form onSubmit={handleSubmit} >
			<div className='window'>
				<div className='overlay'></div>
				<div className='content'>
				<div className='welcome'>{name}</div>
				<div className='subtitle'>Please Login or Register</div>
				<div className='input-fields'>
					<input
							className="input-line full-width"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Username"
						/>
					{method === "register" && (
					<input
							className="input-line full-width"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email"
						/>
					)}
					<input
							className="input-line full-width"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
						/>

				</div>
				<div><button type='submit' className='ghost-round full-width'>{name}</button></div>
				{method === "login" && (<div className='spacing'>or <a href='/register'>Create an account</a></div>)}
				{method === "register" && (<div className='spacing'>or <a href='/login'>Login</a></div>)}
				</div>
			</div>
	        </form>
			{/* <h1>{name}</h1>

			{method === "register" && (

			<input
				className="form-input"
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Email"
			/>)}
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">
                {name}
            </button> */}
			</div>
//   </form>
    );
}
export default Form;
