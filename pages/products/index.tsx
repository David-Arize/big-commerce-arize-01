import { Button, Dropdown, Panel, Link as StyledLink, Table, TableSortDirection } from '@bigcommerce/big-design';
import { MoreHorizIcon } from '@bigcommerce/big-design-icons';
import { LinkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import ProductImage from '@components/product/pruduct-image';
import ErrorMessage from '../../components/shared/error';
import Loading from '../../components/shared/loading';
import { useProductList } from '../../lib/hooks';
import { TableItem } from '../../types';

const Products = () => {
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [columnHash, setColumnHash] = useState('');
    const [direction, setDirection] = useState<TableSortDirection>('ASC');
    const router = useRouter();
    const { error, isLoading, list = [], meta = {} } = useProductList({
        page: String(currentPage),
        limit: String(itemsPerPage),
        ...(columnHash && { sort: columnHash }),
        ...(columnHash && { direction: direction.toLowerCase() }),
    });
    const itemsPerPageOptions = [10, 20, 50, 100];
    const tableItems: TableItem[] = list.map(({ id, inventory_level: stock, name, price }) => ({
        id,
        name,
        price,
        stock,
    }));

    const onItemsPerPageChange = newRange => {
        setCurrentPage(1);
        setItemsPerPage(newRange);
    };

    const onSort = (newColumnHash: string, newDirection: TableSortDirection) => {
        setColumnHash(newColumnHash === 'stock' ? 'inventory_level' : newColumnHash);
        setDirection(newDirection);
    };



    const renderName = (id: number, name: string): ReactElement => (
        <Link href={`/products/${id}`}>
            <StyledLink>{name}</StyledLink>
        </Link>
    );

    const renderImage = (id: number): ReactElement => (
        <ProductImage pid={id} />
    );


    const renderAction = (id: number): ReactElement => (
        <Dropdown
            items={[
                {
                    content: 'Assign a Model', onItemClick: () => router.push(`/products/${id}`), hash: 'assign', icon: <LinkIcon style={{
                        width: '1.25rem',
                        height: '1.25rem'
                    }} />
                },
                {
                    content: 'Order a Model', onItemClick: () => router.push(`/products/${id}`), hash: 'order', icon: <ShoppingCartIcon style={{
                        width: '1.25rem',
                        height: '1.25rem'
                    }} />
                },
            ]}
            toggle={<Button iconOnly={<MoreHorizIcon color="secondary60" />} variant="subtle" />}
        />
    );

    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <Panel id="products">
            <Table
                columns={[
                    { header: '', hash: 'image', render: ({ id }) => renderImage(id), isSortable: true },
                    { header: 'Product name', hash: 'name', render: ({ id, name }) => renderName(id, name), isSortable: true },
                    { header: 'Action', hideHeader: true, hash: 'id', render: ({ id }) => renderAction(id) },
                ]}
                items={tableItems}
                itemName="Products"
                pagination={{
                    currentPage,
                    totalItems: meta?.pagination?.total,
                    onPageChange: setCurrentPage,
                    itemsPerPageOptions,
                    onItemsPerPageChange,
                    itemsPerPage,
                }}
                sortable={{
                    columnHash,
                    direction,
                    onSort,
                }}
                stickyHeader
            />
        </Panel>
    );
};

export default Products;
