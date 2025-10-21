import { Flex, Heading, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation(['common']);

  return (
    <Flex
      flexDir='column'
      h={24}
      w='100%'
      bgColor='red.100'
      textAlign='center'
      justifyContent='center'>
      <Heading>{t('common:footer.title')}</Heading>
      <Text>{t('common:footer.description')}</Text>
    </Flex>
  );
}

export { Footer };
