import prisma from '../db';

interface ReceiptSettingsUpdateData {
  logoUrl?: string;
  headerText?: string;
  footerText?: string;
  showAddress?: boolean;
  showPhone?: boolean;
  showEmail?: boolean;
  showWebsite?: boolean;
  showLoyaltyPoints?: boolean;
  showMemberName?: boolean;
  receiptTitle?: string;
  customCss?: string;
}

/**
 * Updates or creates receipt settings for a given organization.
 * @param organizationId - The ID of the organization to update settings for.
 * @param data - A JSON object with the fields to update.
 * @returns The updated receipt settings.
 */
export async function updateReceiptSettings(organizationId: string, data: ReceiptSettingsUpdateData) {
  try {
    const receiptSettings = await prisma.receiptSetting.upsert({
      where: {
        organizationId: organizationId,
      },
      update: {
        ...data,
      },
      create: {
        organizationId: organizationId,
        ...data,
      },
      include: {
        organization: true, // Optionally include organization data
      },
    });

    return receiptSettings;
  } catch (error) {
    console.error('Error updating receipt settings:', error);
    throw new Error('Could not update receipt settings.');
  }
}
