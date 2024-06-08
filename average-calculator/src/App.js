import React, { useState } from 'react';
import axios from 'axios';
import './App.css';


const App = () => {
    const [numberId, setNumberId] = useState('p');
    const [result, setResult] = useState(null);

    const fetchNumbers = async () => {
        try {
            const response = await axios.get(`http://localhost:9876/numbers/${numberId}`);
            setResult(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="App">
            <h1>Average Calculator</h1>
            <div>
                <label>
                    Select Number Type:
                    <select value={numberId} onChange={(e) => setNumberId(e.target.value)}>
                        <option value="p">Prime</option>
                        <option value="f">Fibonacci</option>
                        <option value="e">Even</option>
                        <option value="r">Random</option>
                    </select>
                </label>
                <button onClick={fetchNumbers}>Fetch Numbers</button>
            </div>
            {result && (
                <div>
                    <h2>Results:</h2>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default App;
