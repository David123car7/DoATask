"use client" // Necessário para hooks e interatividade

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './page.module.css';

export default function EditAddressPage() {
  const router = useRouter();
  const params = useParams();
  const [address, setAddress] = useState({
    street: '',
    port: '',
    postalCode: ''
  });

  // Busca os dados da morada ao carregar
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch(`/api/addresses/${params.id}`);
        const data = await response.json();
        setAddress(data);
      } catch (error) {
        console.error("Erro ao carregar morada:", error);
      }
    };
    fetchAddress();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/addresses/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Falha ao atualizar');
      router.push('/user'); // Redireciona após sucesso
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Editar Morada</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Rua:</label>
          <input
            type="text"
            value={address.street}
            onChange={(e) => setAddress({...address, street: e.target.value})}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Número:</label>
          <input
            type="number"
            value={address.port}
            onChange={(e) => setAddress({...address, port: e.target.value})}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Código Postal:</label>
          <input
            type="text"
            value={address.postalCode}
            onChange={(e) => setAddress({...address, postalCode: e.target.value})}
            required
          />
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" onClick={() => router.back()} className={styles.cancelButton}>
            Cancelar
          </button>
          <button type="submit" className={styles.submitButton}>
            Guardar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}