import { Link } from '@inertiajs/react';

export const Pagination = ({ items }) => {
    return (
        <div className="item-center flex justify-between">
            <p>
                {' '}
                Showing <strong>{items.from} </strong> to <strong>{items.to}</strong> from total <strong> {items.total}</strong> entries
            </p>
            <div className="flex gap-1">
                {items.links.map((link, index) => (
                    <Link
                        className={`rounded border px-3 py-1 ${link.active ? 'bg-[var(--btn-base-color)] text-white hover:bg-[var(--btn-base-hover-color)]' : ''}`}
                        href={link.url || '#'}
                        key={index}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
};
