import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Select,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

const Order: React.FC = () => {
  const location = useLocation();
  const product = location.state?.product;

  type FormData = {
    receipt: boolean;
    taxType: string;
    taxNumber: string;
    cardMessage: string;
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      receipt: false,
      taxType: 'personal',
      taxNumber: '',
      cardMessage: '',
    },
  });

  const [formData, setFormData] = useState<FormData>({
    receipt: false,
    taxType: 'personal',
    taxNumber: '',
    cardMessage: '',
  });

  const onSubmit = (data: FormData) => {
    if (!data.cardMessage) {
      alert('메시지를 입력해주세요.');
      return;
    }
    if (data.cardMessage.length > 100) {
      alert('메시지를 100자 이내로 입력해주세요.');
      return;
    }
    if (data.receipt && !data.taxNumber) {
      alert('현금영수증 번호를 입력해주세요.');
      return;
    }
    alert('결제하기 버튼을 눌렀습니다.');
  };

  const handleChange = <T extends Path<FormData>>(name: T, value: FieldValues[T]) => {
    setValue(name, value, { shouldValidate: true }); // React Hook Form의 상태 업데이트
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (!product) {
    return <Text>상품 정보가 없습니다.</Text>;
  }

  return (
    <Box p={4}>
      <Text fontSize="xl" mb={4}>
        나에게 주는 선물
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={4}>
          <Controller
            name="cardMessage"
            control={control}
            rules={{
              required: '메시지를 입력해주세요.',
              maxLength: {
                value: 100,
                message: '메시지를 100자 이내로 입력해주세요.',
              },
            }}
            render={({ field }) => (
              <FormControl isInvalid={!!errors.cardMessage}>
                <Input
                  placeholder="선물과 함께 보낼 메시지를 적어보세요"
                  {...field}
                  value={formData.cardMessage}
                  onChange={(e) => handleChange('cardMessage', e.target.value)}
                />
                {errors.cardMessage && (
                  <Text color="red.500" mt={2}>
                    {errors.cardMessage.message}
                  </Text>
                )}
              </FormControl>
            )}
          />
        </Box>
        <Box borderWidth="1px" borderRadius="lg" p={4} mb={4}>
          <Text fontSize="lg" mb={2}>
            선물 내역
          </Text>
          <Flex>
            <Image
              src={product.imageUrl}
              alt="상품 이미지"
              boxSize="100px"
              objectFit="cover"
              mr={4}
            />
            <Box>
              <Text>{product.name}</Text>
              <Text>{product.price}원 x 1개</Text>
            </Box>
          </Flex>
        </Box>
        <Box borderWidth="1px" borderRadius="lg" p={4} width="100%" mx="auto">
          <Text fontSize="xl" mb={4}>
            결제 정보
          </Text>
          <FormControl display="flex" alignItems="left" mb={4}>
            <Controller
              name="receipt"
              control={control}
              render={({ field }) => (
                <Checkbox
                  isChecked={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    handleChange('receipt', e.target.checked);
                  }}
                  mr={2}
                >
                  현금영수증 신청
                </Checkbox>
              )}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>공제 유형</FormLabel>
            <Controller
              name="taxType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={formData.taxType}
                  onChange={(e) => handleChange('taxType', e.target.value)}
                >
                  <option value="personal">개인소득공제</option>
                  <option value="business">사업자지출증빙</option>
                </Select>
              )}
            />
          </FormControl>
          <FormControl mb={4} isInvalid={!!errors.taxNumber}>
            <FormLabel>현금영수증 번호</FormLabel>
            <Controller
              name="taxNumber"
              control={control}
              rules={{
                validate: (value) => !isNaN(Number(value)) || '숫자만 입력해주세요.',
              }}
              render={({ field }) => (
                <Input
                  placeholder="(-없이) 숫자만 입력해주세요."
                  {...field}
                  value={formData.taxNumber}
                  onChange={(e) => handleChange('taxNumber', e.target.value)}
                />
              )}
            />
            {errors.taxNumber && (
              <Text color="red.500" mt={2}>
                {errors.taxNumber.message}
              </Text>
            )}
          </FormControl>
          <Box mb={4}>
            <Text>최종 결제금액</Text>
            <Text fontSize="2xl" fontWeight="bold">
              {product.price}원
            </Text>
          </Box>
          <Box display="flex" justifyContent="center">
            <Button type="submit" colorScheme="yellow" size="lg" width="50%">
              {product.price}원 결제하기
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default Order;
