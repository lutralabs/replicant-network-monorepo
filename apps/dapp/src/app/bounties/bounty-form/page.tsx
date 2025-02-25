'use client';

import React from 'react';

import { BountyForm } from './BountyForm';

export default function Page() {
  return (
    <div className="w-full">
      <div className="text-lg font-semibold">Create a Bounty</div>
      <div className="border-sidebar-border mt-12 mb-4 w-full rounded-md border-2 bg-white px-4 pt-4 pb-6">
        <BountyForm />
      </div>
    </div>
  );
}
