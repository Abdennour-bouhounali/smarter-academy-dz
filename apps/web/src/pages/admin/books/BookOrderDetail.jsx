import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AdminPage, Num, btnSecondary } from '../adminUi';
import { useDocumentMeta } from '../../../hooks/useDocumentMeta';
import { S } from '../../../features/books/strings';
import OrderDetailPanel from './OrderDetailPanel';

const A = S.admin;

/**
 * La fiche d'une commande en PAGE — l'adresse qu'ouvre une notification « طلب جديد »
 * (`AdminPush`). Depuis la liste, la même fiche s'ouvre dans une fenêtre (`BookOrders`).
 */
export default function AdminBookOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reference, setReference] = useState(null);
  useDocumentMeta(reference ? `${A.ordersTitle} ${reference}` : A.ordersTitle);

  return (
    <AdminPage
      eyebrow={A.eyebrow}
      title={reference ? <Num>{reference}</Num> : A.ordersTitle}
      actions={<Link to="/admin/livres/commandes" className={btnSecondary}>{A.back}</Link>}
    >
      <OrderDetailPanel
        orderId={id}
        onLoaded={(order) => setReference(order.reference)}
        onDeleted={() => navigate('/admin/livres/commandes')}
      />
    </AdminPage>
  );
}
