import { Flex, Heading, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

function Header() {
  const { t } = useTranslation(['common']);

  return (
    <Flex
      flexDir='column'
      h={24}
      w='100%'
      bgColor='blue.100'
      textAlign='center'
      justifyContent='center'>
      <Heading as='h3'>{t('common:header.title')}</Heading>
      <Text>{t('common:header.description')}</Text>
    </Flex>
  );
}

export { Header };
