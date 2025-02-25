'use client';

import React from 'react';
import { BountyForm } from './BountyForm';

export default function Page() {
  return (
    <div className="w-full">
      <div className="text-lg font-semibold">Create a Bounty</div>
      <div className="border-2 border-sidebar-border w-full bg-white rounded-md mt-12 px-4 pt-4 pb-6 mb-4">
        <BountyForm />
      </div>
    </div>
  );
}
