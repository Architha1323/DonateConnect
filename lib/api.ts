import * as donationsActions from '@/actions/donations';
import * as usersActions from '@/actions/users';
import * as authActions from '@/actions/auth';
import * as ngoActions from '@/actions/ngos';
import * as beneficiaryActions from '@/actions/beneficiaries';

// A mock API client that redirects requests to Server Actions
const api = {
  get: async (url: string, config?: any) => {
    const params = config?.params || {};
    let data: any = null;

    if (url === '/auth/me') {
      data = await authActions.getCurrentUser();
      if (!data) throw new Error('Not authenticated');
    } else if (url === '/donations/stats') {
      data = await donationsActions.getDonorStats();
    } else if (url === '/ngos/stats') {
      data = await ngoActions.getNgoStats();
    } else if (url.split('?')[0] === '/donations') {
      data = await donationsActions.getDonations(params);
      if (data.error) throw new Error(data.error);
      return { data: { data: data.donations, meta: { total: data.total, totalPages: data.totalPages } } };
    } else if (url.startsWith('/donations/')) {
      const id = url.split('/')[2];
      data = await donationsActions.getDonationById(id);
      if (data.error) throw new Error(data.error);
      return { data: { data: data.donation } };
    } else if (url === '/beneficiaries') {
      data = await beneficiaryActions.getBeneficiaries(params);
      return { data: { data: data.beneficiaries } };
    } else if (url.split('?')[0] === '/ngos') {
      data = await ngoActions.getNgos(params);
      return { data: { data: data.ngos, meta: { total: data.total, totalPages: data.totalPages } } };
    }

    return { data: { data } };
  },

  post: async (url: string, body?: any) => {
    let data: any = null;
    
    if (url === '/auth/login') {
      data = await authActions.signIn(body);
      if (data.error) throw new Error(data.error);
      
      // Fetch user directly from DB since cookies aren't available in the same request yet
      const { prisma } = await import('@/lib/prisma');
      const user = await prisma.user.findUnique({ 
        where: { email: body.email },
        include: { ngo: true, beneficiary: true }
      });
      return { data: { data: { user, token: 'mock-token' } } };
    } else if (url === '/auth/register') {
      data = await authActions.signUp(body);
      if (data.error) throw new Error(data.error);
      
      // signUp returns the user directly
      return { data: { data: { user: data.user, token: 'mock-token' } } };
    } else if (url === '/donations') {
      data = await donationsActions.createDonation(body);
      if (data.error) throw new Error(data.error);
    } else if (url.match(/\/donations\/[a-zA-Z0-9-]+\/accept/)) {
      const id = url.split('/')[2];
      data = await donationsActions.updateDonationStatus(id, 'ACCEPTED');
      if (data.error) throw new Error(data.error);
    }

    return { data: { data } };
  },

  patch: async (url: string, body?: any) => {
    let data: any = null;

    if (url.match(/\/donations\/[a-zA-Z0-9-]+\/status/)) {
      const id = url.split('/')[2];
      data = await donationsActions.updateDonationStatus(id, body.status);
      if (data.error) throw new Error(data.error);
    }

    return { data: { data } };
  },

  delete: async (url: string) => {
    let data: any = null;
    
    if (url.startsWith('/donations/')) {
      const id = url.split('/')[2];
      data = await donationsActions.deleteDonation(id);
      if (data.error) throw new Error(data.error);
    }

    return { data: { data } };
  },
};

export default api;
