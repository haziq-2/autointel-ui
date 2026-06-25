"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MARKETPLACES } from "@/lib/constants";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Workspace configuration" />

      <Tabs defaultValue="general">
        <TabsList className="h-9 bg-transparent p-0 gap-4">
          <TabsTrigger value="general" className="rounded-none border-0 border-b-2 border-transparent px-0 pb-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none">
            General
          </TabsTrigger>
          <TabsTrigger value="integrations" className="rounded-none border-0 border-b-2 border-transparent px-0 pb-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none">
            Integrations
          </TabsTrigger>
          <TabsTrigger value="team" className="rounded-none border-0 border-b-2 border-transparent px-0 pb-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none">
            Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-8 max-w-md space-y-5">
          <Field label="Workspace name" defaultValue="Premier Auto Group" />
          <Field label="Default location" defaultValue="Dallas, TX" />
          <Button size="sm">Save</Button>
        </TabsContent>

        <TabsContent value="integrations" className="mt-8 max-w-lg">
          <div className="divide-y divide-border border-y border-border">
            {MARKETPLACES.map((name) => (
              <div key={name} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-[13px] font-medium">{name}</p>
                  <p className="text-label">Connected</p>
                </div>
                <span className="text-label">Active</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="team" className="mt-8 max-w-md space-y-0 divide-y divide-border border-y border-border">
          {[
            { name: "James Mitchell", role: "Admin" },
            { name: "Sarah Kim", role: "Acquisitions" },
            { name: "Michael Torres", role: "Analyst" },
          ].map((m) => (
            <div key={m.name} className="flex items-center justify-between py-3">
              <div>
                <p className="text-[13px] font-medium">{m.name}</p>
                <p className="text-label">{m.role}</p>
              </div>
            </div>
          ))}
          <div className="py-4">
            <Button variant="outline" size="sm">Invite member</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div>
      <label className="text-label">{label}</label>
      <Input defaultValue={defaultValue} className="mt-1.5 h-9 border-border text-[13px] shadow-none" />
    </div>
  );
}
