import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import {withSwal} from "react-sweetalert2";

function SettingsPage({swal}) {
  const [products, setProducts] = useState([]);
  const [featuredProductId, setFeaturedProductId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shippingFee, setShippingFee] = useState('');

  useEffect(() => {
    setIsLoading(true);
    fetchAll().then(() => {
      setIsLoading(false);
    });
  }, []);

  async function fetchAll() {
    try {
      const productsResponse = await axios.get('/api/products');
      setProducts(productsResponse.data);
  
      const featuredProductResponse = await axios.get('/api/settings?name=featuredProductId');
      console.log("featuredProductResponse:", featuredProductResponse);
      setFeaturedProductId(featuredProductResponse.data.value);
  
      const shippingFeeResponse = await axios.get('/api/settings?name=shippingFee');
      console.log("shippingFeeResponse:", shippingFeeResponse); 
      setShippingFee(shippingFeeResponse.data.value);
    } catch (error) {
      console.error("Une erreur s'est produite lors de la récupération des données :", error);
    }
  }

  async function saveSettings() {
    setIsLoading(true);
    await axios.put('/api/settings', {
      name: 'featuredProductId',
      value: featuredProductId,
    });
    await axios.put('/api/settings', {
      name: 'shippingFee',
      value: shippingFee,
    });
    setIsLoading(false);
    await swal.fire({
      title: 'Paramètres sauvegardés!',
      icon: 'success',
    });
  }

  return (
    <Layout>
      <h1>Paramètres</h1>
      {isLoading && (
        <Spinner />
      )}
      {!isLoading && (
        <>
          <label>Produit vedette</label>
          <select value={featuredProductId} onChange={ev => setFeaturedProductId(ev.target.value)}>
            {products.length > 0 && products.map(product => (
              <option value={product._id}>{product.title}</option>
            ))}
          </select>
          <label>Prix ​​frais de port (en euro)</label>
          <input type="number"
                 value={shippingFee}
                 onChange={ev => setShippingFee(ev.target.value)}
          />
          <div>
            <button onClick={saveSettings} className="btn-primary">Sauvegarder les paramètres</button>
          </div>
        </>
      )}
    </Layout>
  );
}

export default withSwal(({swal}) => (
  <SettingsPage swal={swal} />
));