import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { PageProvider } from '@/providers/PageProvider';
import { routesUrl } from '@/routes/routesConfig';

function Index() {
  const { t } = useTranslation(['common']);

  return (
    <PageProvider>
      <Flex
        flexDir='column'
        flex={1}
        w='100%'
        textAlign='center'
        justifyContent='center'>
        <Heading>{t('common:page.title')}</Heading>
        <Text>{t('common:page.description')}</Text>
        <Link to={routesUrl.other}>
          <Button colorScheme='blue' mt={4}>
            Go to &quot;Other Page&quot;
          </Button>
        </Link>
      </Flex>
    </PageProvider>
  );
}

export { Index };
