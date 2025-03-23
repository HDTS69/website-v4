'use client';

import { useCallback } from 'react';
import supabase from '@/lib/supabase';
import type { FormData } from './useFormState';

interface UseFormSubmissionProps {
  formData: FormData;
  setIsSubmitting: (value: boolean) => void;
  setSubmitStatus: (value: 'idle' | 'success' | 'error') => void;
  setShowThankYou: (value: boolean) => void;
  resetForm: () => void;
}

export const useFormSubmission = ({
  formData,
  setIsSubmitting,
  setSubmitStatus,
  setShowThankYou,
  resetForm,
}: UseFormSubmissionProps) => {
  const submitForm = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setSubmitStatus('idle');

      const supabaseData = {
        created_at: new Date().toISOString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        services: formData.services,
        preferred_time: formData.preferredTime,
        urgency: formData.urgency,
        preferred_date: formData.preferredDate ? new Date(formData.preferredDate).toISOString().split('T')[0] : null,
        preferred_date_type: formData.preferredDateType || 'specific',
        preferred_date_range: formData.preferredDateRange || null,
        message: formData.message,
        newsletter: formData.newsletter,
        terms_accepted: formData.termsAccepted,
        status: 'pending'
      };

      // Save to Supabase
      const { error: supabaseError } = await supabase
        .from('bookings')
        .insert([supabaseData])
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message || "Failed to submit booking");
      }

      // Send email notifications
      const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          services: formData.services,
          preferredTime: formData.preferredTime,
          message: formData.message || '',
        }),
      });

      if (!emailResponse.ok) {
        console.warn('Email notification failed, but booking was saved');
      }

      setSubmitStatus('success');
      console.log('Setting showThankYou to true after successful submission');
      setShowThankYou(true);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, setIsSubmitting, setSubmitStatus, setShowThankYou, resetForm]);

  return {
    submitForm,
  };
}; 