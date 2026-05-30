// Contact form schema is rewritten in Phase 3 against the new next-intl
// message files. Placeholder kept so the module path remains stable.
import type {ContactFormValues} from '@/types';

export const contactDefaultValues: ContactFormValues = {
  name: '',
  email: '',
  message: '',
};
