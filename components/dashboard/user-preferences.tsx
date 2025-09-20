'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPreferences } from '@/types/finance';
import { currencies } from '@/lib/currency';
import { Settings, Save } from 'lucide-react';

interface UserPreferencesProps {
  preferences: UserPreferences;
  onUpdatePreferences: (preferences: UserPreferences) => void;
}

export function UserPreferencesCard({ preferences, onUpdatePreferences }: UserPreferencesProps) {
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdatePreferences(localPreferences);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalPreferences(preferences);
    setIsEditing(false);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Preferences
          </CardTitle>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Preferred Currency</Label>
          {isEditing ? (
            <Select 
              value={localPreferences.preferredCurrency} 
              onValueChange={(value) => setLocalPreferences({...localPreferences, preferredCurrency: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{currency.symbol}</span>
                      <span>{currency.code}</span>
                      <span className="text-muted-foreground">- {currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="p-2 bg-gray-50 rounded-md">
              {currencies.find(c => c.code === preferences.preferredCurrency)?.name} ({preferences.preferredCurrency})
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Monthly Savings Goal</Label>
          {isEditing ? (
            <Input
              type="number"
              value={localPreferences.savingsGoal}
              onChange={(e) => setLocalPreferences({...localPreferences, savingsGoal: parseFloat(e.target.value) || 0})}
              placeholder="Enter savings goal"
            />
          ) : (
            <div className="p-2 bg-gray-50 rounded-md">
              ${preferences.savingsGoal.toFixed(2)}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Label>Budget Alerts</Label>
          {isEditing ? (
            <Switch
              checked={localPreferences.budgetAlerts}
              onCheckedChange={(checked) => setLocalPreferences({...localPreferences, budgetAlerts: checked})}
            />
          ) : (
            <div className={`px-2 py-1 rounded-md text-sm ${preferences.budgetAlerts ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {preferences.budgetAlerts ? 'Enabled' : 'Disabled'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}