'use client';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { format, addMonths } from 'date-fns';

type EngineerType = 'junior' | 'senior';
type EngineerLocation = 'onshore' | 'offshore';

interface EngineeringCosts {
  [key: string]: { count: number; salary: number };
}

interface SaaSProduct {
  name: string;
  category: string;
  costPerSeat: number;
  isSelected: boolean;
}

interface RunwayData {
  month: string;
  runway: number;
  monthlyBurn: number;
}

const defaultSaaSProducts: SaaSProduct[] = [
  { name: 'Slack', category: 'Messaging', costPerSeat: 8, isSelected: true },
  { name: 'Teams', category: 'Messaging', costPerSeat: 5, isSelected: false },
  { name: 'GitHub', category: 'Version Control', costPerSeat: 7, isSelected: true },
  { name: 'GitLab', category: 'Version Control', costPerSeat: 4, isSelected: false },
  { name: 'Hubspot', category: 'CRM', costPerSeat: 50, isSelected: false },
  { name: 'Salesforce', category: 'CRM', costPerSeat: 150, isSelected: false },
  { name: 'Workday', category: 'HR', costPerSeat: 100, isSelected: false },
  { name: 'Jira', category: 'Project Management', costPerSeat: 7, isSelected: false },
  { name: 'Asana', category: 'Project Management', costPerSeat: 10, isSelected: true },
  { name: 'Linear', category: 'Project Management', costPerSeat: 8, isSelected: false },
  { name: 'Confluence', category: 'Documentation', costPerSeat: 5, isSelected: false },
  { name: 'Zoom', category: 'Communication', costPerSeat: 15, isSelected: false },
  { name: 'Google Workspace', category: 'Productivity', costPerSeat: 6, isSelected: true },
];

const defaultOfficeExpenses = {
  rent: 1000,
  utilities: 200,
  internet: 100,
  phone: 50,
  maintenance: 150,
};

const StartupRunwayEstimator: React.FC = () => {
  const [totalFunding, setTotalFunding] = useState<number>(4000000);
  const [engineeringCosts, setEngineeringCosts] = useState<EngineeringCosts>({
    juniorOnshore: { count: 1, salary: 60000 },
    seniorOnshore: { count: 2, salary: 170000 },
    juniorOffshore: { count: 3, salary: 30000 },
    seniorOffshore: { count: 2, salary: 60000 },
  });
  const [saasProducts, setSaasProducts] = useState<SaaSProduct[]>(defaultSaaSProducts);
  const [marketingBudget, setMarketingBudget] = useState<number>(1000);
  const [inOfficeEmployees, setInOfficeEmployees] = useState<number>(0);
  const [acquisitionsCost, setAcquisitionsCost] = useState<number>(0);
  const [runwayData, setRunwayData] = useState<RunwayData[]>([]);
  const [cloudCredits, setCloudCredits] = useState<number>(50000);
  const [cloudMonthlyExpense, setCloudMonthlyExpense] = useState<number>(500);

  useEffect(() => {
  const calculateMonthlyBurn = () => {
    const engineeringBurn = Object.values(engineeringCosts).reduce(
      (total, { count, salary }) => total + (count * salary) / 12,
      0
    );

    const totalEngineers = Object.values(engineeringCosts).reduce((total, { count }) => total + count, 0);
    const saasBurn = saasProducts
      .filter((product) => product.isSelected)
      .reduce((total, product) => total + product.costPerSeat * totalEngineers, 0);

    const officeBurn = Object.values(defaultOfficeExpenses).reduce((a, b) => a + b, 0) * inOfficeEmployees;

    return engineeringBurn + saasBurn + marketingBudget + officeBurn + cloudMonthlyExpense;
  };

  
    const calculateRunway = () => {
      let initialMonthlyBurn = calculateMonthlyBurn();
      const runway = [];
      let remainingFunds = totalFunding - acquisitionsCost + cloudCredits;
      let month = 0;
      let monthlyBurn = initialMonthlyBurn;
      const currentDate = new Date();
  
      while (remainingFunds > 0) {
        const monthDate = addMonths(currentDate, month);
        runway.push({ 
          month: format(monthDate, 'MMM yyyy'), 
          runway: Math.max(remainingFunds, 0), 
          monthlyBurn 
        });
        remainingFunds -= monthlyBurn;
        monthlyBurn *= 1.1; // Increase burn rate by 10% each month
        month++;
      }
  
      setRunwayData(runway);
    };
    calculateRunway();
  }, [totalFunding, engineeringCosts, saasProducts, marketingBudget, inOfficeEmployees, acquisitionsCost, cloudCredits, cloudMonthlyExpense]);

  const handleEngineeringCostChange = (
    type: EngineerType,
    location: EngineerLocation,
    field: 'count' | 'salary',
    value: number
  ) => {
    setEngineeringCosts((prev) => ({
      ...prev,
      [`${type}${location.charAt(0).toUpperCase() + location.slice(1)}`]: {
        ...prev[`${type}${location.charAt(0).toUpperCase() + location.slice(1)}`],
        [field]: value,
      },
    }));
  };

  const handleSaaSProductToggle = (index: number) => {
    setSaasProducts((prev) =>
      prev.map((product, i) =>
        i === index ? { ...product, isSelected: !product.isSelected } : product
      )
    );
  };

  return (
    <div className="mx-auto p-4 bg-gradient-to-r from-purple-400 via-orange-500 to-red-500 min-h-screen">
      <h2 className="text-4xl font-bold text-white mb-8 text-center">Startup Runway Estimator</h2>
      <div className="grid grid-cols-1 gap-4">
        <Card className="col-span-1 bg-white bg-opacity-90">
            <CardHeader>
            <CardTitle>Runway Projection ~{runwayData.length} months</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={runwayData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" label={{ value: 'Months', position: 'insideBottom', offset: -5 }} />
                <YAxis 
                  yAxisId="left" 
                  label={{ value: 'Runway ($)', angle: -90, position: 'insideLeft', offset: -12 }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  label={{ value: 'Monthly Burn ($)', angle: 90, position: 'insideRight', offset: -20 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    `$${Number(value).toLocaleString()}`, 
                    name === 'runway' ? 'Runway' : 'Monthly Burn'
                  ]}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="runway" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="monthlyBurn" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Funding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">$</span>
                <Input
                  type="number"
                  value={totalFunding}
                  onChange={(e) => setTotalFunding(Number(e.target.value))}
                  className="w-full pl-7"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cloud Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">$</span>
                <Input
                  type="number"
                  value={cloudCredits}
                  onChange={(e) => setCloudCredits(Number(e.target.value))}
                  className="w-full pl-7"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cloud Monthly Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">$</span>
                <Input
                  type="number"
                  value={cloudMonthlyExpense}
                  onChange={(e) => setCloudMonthlyExpense(Number(e.target.value))}
                  className="w-full pl-7"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Engineering Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Onshore</h3>
                  {(['junior', 'senior'] as EngineerType[]).map((type) => (
                    <div key={`${type}-onshore`} className="mb-2">
                      <Label>{`${type}`}</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          placeholder="Count"
                          value={engineeringCosts[`${type}Onshore`].count}
                          onChange={(e) => handleEngineeringCostChange(type, 'onshore', 'count', Number(e.target.value))}
                          className="w-2/5"
                        />
                        <div className="relative w-3/5">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3">$</span>
                          <Input
                            type="number"
                            placeholder="Salary"
                            value={engineeringCosts[`${type}Onshore`].salary}
                            onChange={(e) => handleEngineeringCostChange(type, 'onshore', 'salary', Number(e.target.value))}
                            className="w-full pl-7"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Offshore</h3>
                  {(['junior', 'senior'] as EngineerType[]).map((type) => (
                    <div key={`${type}-offshore`} className="mb-2">
                      <Label>{`${type}`}</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          placeholder="Count"
                          value={engineeringCosts[`${type}Offshore`].count}
                          onChange={(e) => handleEngineeringCostChange(type, 'offshore', 'count', Number(e.target.value))}
                          className="w-2/5"
                        />
                        <div className="relative w-3/5">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3">$</span>
                          <Input
                            type="number"
                            placeholder="Salary"
                            value={engineeringCosts[`${type}Offshore`].salary}
                            onChange={(e) => handleEngineeringCostChange(type, 'offshore', 'salary', Number(e.target.value))}
                            className="w-full pl-7"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>SaaS Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {Array.from(new Set(saasProducts.map(product => product.category))).map(category => (
                  <div key={category}>
                    <h3 className="font-semibold mb-2">{category}</h3>
                    <div className="space-y-2">
                      {saasProducts.filter(product => product.category === category).map((product, index) => (
                        <div key={product.name} className="flex items-center">
                          <Checkbox
                            id={`saas-${index}`}
                            checked={product.isSelected}
                            onCheckedChange={() => handleSaaSProductToggle(saasProducts.indexOf(product))}
                          />
                          <Label htmlFor={`saas-${index}`} className="ml-2">
                            {product.name} (${product.costPerSeat}/seat)
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Budget (Monthly)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">$</span>
                <Input
                  type="number"
                  value={marketingBudget}
                  onChange={(e) => setMarketingBudget(Number(e.target.value))}
                  className="w-full pl-7"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Office Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <Label>In-office Employees</Label>
              <Input
                type="number"
                value={inOfficeEmployees}
                onChange={(e) => setInOfficeEmployees(Number(e.target.value))}
                className="w-full"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acquisitions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">$</span>
                <Input
                  type="number"
                  value={acquisitionsCost}
                  onChange={(e) => setAcquisitionsCost(Number(e.target.value))}
                  className="w-full pl-7"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StartupRunwayEstimator;
