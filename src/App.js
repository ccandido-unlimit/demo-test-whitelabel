// App.js
import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const App = () => {
  const [configData, setConfigData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const secretkey = "BKxkBRExdqfREsPwEwbydIBSEGssHNAo";
  const apiPath = "/allConfigs";
  const baseUrl = "https://api-sandbox.gatefi.com/v1/external";

  // Função para calcular o hash de autenticação (HMAC)
  const calcAuthSigHash = (data) => {
    const hash = CryptoJS.HmacSHA256(data, secretkey);
    return CryptoJS.enc.Hex.stringify(hash);
  };

  // Função para buscar a configuração da API
  const fetchConfigs = async () => {
    setLoading(true);
    setError(null);
    const method = "GET";
    const dataToVerify = method + apiPath;
    const signature = calcAuthSigHash(dataToVerify); // Gerar assinatura HMAC

    try {
      const response = await fetch(`${baseUrl}${apiPath}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'signature': signature,
          'api-key': 'fGhKXIdWINsjKFuMZpnKqPrlWOIGocRE'  // Substitua pela sua chave de API
        }
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }

      const data = await response.json();
      setConfigData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para chamar a API assim que o componente for montado
  useEffect(() => {
    fetchConfigs();
  }, []);

  return (
    <div className="App">
      <h1>GateFi Configurações</h1>

      {loading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}

      {configData && (
        <div>
          <h2>Dados de Configuração:</h2>
          <pre>{JSON.stringify(configData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
