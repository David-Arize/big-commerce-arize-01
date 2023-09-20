import { useRouter } from 'next/router';
import { useModels } from '@lib/hooks/useModels.hook';
import Form from '../../components/product/form';
import ErrorMessage from '../../components/shared/error';
import Loading from '../../components/shared/loading';
import { useSession } from '../../context/session';
import { useProductCustomFieldsInfo, useProductInfo, useProductList } from '../../lib/hooks';
import { FormData } from '../../types';

const ProductInfo = () => {
    const router = useRouter();
    const encodedContext = useSession()?.context;
    const pid = Number(router.query?.pid);
    const { error, isLoading, list = [], mutateList } = useProductList();
    const { isLoading: isInfoLoading, product } = useProductInfo(pid);
    const { customFields } = useProductCustomFieldsInfo(pid);
    const { models } = useModels();
    const { description, is_visible: isVisible, name, price, type } = product ?? {};

    const formData = { description, isVisible, name, price, type };

    const handleCancel = () => router.push('/products');

    const handleSubmit = async (data: FormData) => {
        try {
            const filteredList = list.filter(item => item.id !== pid);
            const { description, isVisible, name, price, type } = data;
            const apiFormattedData = { description, is_visible: isVisible, name, price, type };

            // Update local data immediately (reduce latency to user)
            mutateList([...filteredList, { ...product, ...data }], false);

            // Update product details
            await fetch(`/api/products/${pid}?context=${encodedContext}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apiFormattedData),
            });

            console.error(customFields);


            // Refetch to validate local data
            mutateList();

            router.push('/products');
        } catch (error) {
            console.error('Error updating the product: ', error);
        }
    };

    if (isLoading || isInfoLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <>
            <Form formData={formData} onCancel={handleCancel} onSubmit={handleSubmit} />
            {models?.map((model, ix) => <div key={ix}><img src={model.thumbnailUrl} style={{ height: '100px' }} /></div>)}
        </>
    );
};

export default ProductInfo;
