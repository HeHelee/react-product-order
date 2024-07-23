import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetProductDetail } from '@/api/hooks/useGetProductDetail';
import { Spinner } from '@/components/common/Spinner';
import { ProductDetailContent } from '@/components/features/ProductDetail/ProductDetail/ProductDetailContent';
import { useAuth } from '@/provider/Auth';

type FormData = {
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
};

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { data, isLoading, isError } = useGetProductDetail(productId || '');
  const navigate = useNavigate();
  const isAuthenticated = useAuth();
  const { handleSubmit, setValue } = useForm<FormData>();

  useEffect(() => {
    if (!isLoading && !data) {
      navigate('/');
    }
    if (data) {
      setValue('productId', productId || '');
      setValue('name', data.detail.name);
      setValue('imageUrl', data.detail.imageURL);
      setValue('price', data.detail.price?.sellingPrice || 0);
    }
  }, [productId, data, isLoading, navigate, setValue]);

  const onSubmit = (formData: FormData) => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?');
      navigate('/login');
    } else if (data) {
      navigate('/order', {
        state: { product: formData },
      });
    }
  };

  if (isLoading)
    return (
      <LoadingContainer>
        <Spinner size={48} />
      </LoadingContainer>
    );
  if (isError) return <TextView>상품을 불러오는 도중에 에러가 발생했습니다.</TextView>;
  if (!data) return <TextView>상품이 없습니다.</TextView>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ProductDetailContent
        imageUrl={data.detail.imageURL}
        name={data.detail.name}
        price={data.detail.price?.sellingPrice}
        onButtonClick={handleSubmit(onSubmit)}
      />
    </form>
  );
};

export default ProductDetail;

const TextView = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 16px 60px;
  font-size: 16px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
