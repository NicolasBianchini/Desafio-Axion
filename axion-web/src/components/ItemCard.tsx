import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import styles from './ItemCard.module.css';

interface ItemCardProps {
    id: number;
    name: string;
    imageUrl?: string;
    onEdit?: () => void;
    onDelete?: () => void;
    onClick?: () => void;
    showActions?: boolean;
}

export const ItemCard = ({
    name,
    imageUrl,
    onEdit,
    onDelete,
    onClick,
    showActions = false
}: ItemCardProps) => {
    return (
        <div
            className={styles.card}
            onClick={onClick}
        >
            {showActions && (onEdit || onDelete) && (
                <div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
                    {onEdit && (
                        <button onClick={onEdit} className={styles.cardAction}>
                            <FiEdit2 size={14} />
                        </button>
                    )}
                    {onDelete && (
                        <button onClick={onDelete} className={styles.cardActionDelete}>
                            <FiTrash2 size={14} />
                        </button>
                    )}
                </div>
            )}
            {imageUrl ? (
                <div className={styles.cardImageWrapper}>
                    <img
                        src={imageUrl}
                        alt={name}
                        className={styles.cardImage}
                    />
                    <h3 className={styles.cardTitle}>{name}</h3>
                </div>
            ) : (
                <div className={styles.cardNoImage}>
                    <h3 className={styles.cardTitleNoImage}>{name}</h3>
                </div>
            )}
        </div>
    );
};
