import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import classNames from 'classnames';
import CustomButton from 'components/CustomButton';
import { GstinsType } from 'services/gstinsAPIService';
import { postGstinCredentialsData } from 'services/credentialsAPIService';
import { toast } from 'react-hot-toast';
import { hideModal } from 'app/utils/Modal';
import { yupEmptyCharsRule } from 'app/utils/YupRules';

interface GstinNewFormProps {
  username: string;
  password: string;
}

interface GstinNewCredentialsFormProps {
  gstinData: GstinsType | null;
  modalId: string;
}

export default function GstinNewCredentialsForm({ modalId, gstinData }: GstinNewCredentialsFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = yup.object({
    username: yup.string().required().test(yupEmptyCharsRule),
    password: yup.string().required().test(yupEmptyCharsRule),
  }).required();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<GstinNewFormProps>({
    resolver: yupResolver(schema),
  });

  const onSubmit = ({ username, password }: GstinNewFormProps) => {
    setIsLoading(true);
    postGstinCredentialsData(gstinData?.id, { username, password })
      .then((r) => {
        setIsLoading(false);
        toast.success('Gstin credentials successfully created.');
        hideModal(modalId);
      }).catch((e) => {
        setIsLoading(false);
        toast.error(e.message);
      }).finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    reset({ password: '', username: '' });
  }, [gstinData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="modal-header">
        <h5 className="modal-title" id={`new${modalId}Label`}>New Gstin Credentials</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
      </div>
      <div className="modal-body">
        <div className="mb-3">
          <label htmlFor="customer" className="col-form-label">
            Gstin:
            {' '}
            {gstinData?.name}
          </label>
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="col-form-label">Username:</label>
          <input
            {...register('username')}
            id="username"
            className={classNames(['form-control form-control-sm', { 'is-invalid': errors.username }])}
            placeholder="Enter Credentials username ..."
          />
          {errors.username && (
            <div id="validationTitleFeedback" className="invalid-feedback">
              <p>{errors.username?.message}</p>
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="col-form-label">Password:</label>
          <input
            {...register('password')}
            id="password"
            type="password"
            className={classNames(['form-control form-control-sm', { 'is-invalid': errors.password }])}
            placeholder="Enter Credentials password ..."
          />
          {errors.password && (
            <div id="validationTitleFeedback" className="invalid-feedback">
              <p>{errors.password?.message}</p>
            </div>
          )}
        </div>

      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-sm btn-danger" data-bs-dismiss="modal">
          Close
        </button>
        <CustomButton
          isLoading={isLoading}
          isSubmit
          className="btn btn-sm btn-primary"
        >
          New Gstin Credentials
        </CustomButton>
      </div>
    </form>
  );
}
