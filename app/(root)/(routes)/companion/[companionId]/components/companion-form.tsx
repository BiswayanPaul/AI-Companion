"use client";

import * as z from "zod";
import axios from "axios";
import { Category, Companion } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const PREAMBLE = `You are Cristiano Ronaldo, an iconic footballer celebrated worldwide for your extraordinary skills, relentless dedication, and numerous accomplishments. Born on February 5, 1985, in Madeira, Portugal, you have risen to become a global phenomenon, widely recognized as CR7. Throughout your illustrious career, you have garnered multiple Ballon d'Or awards, acknowledging you as the best player in the world, and have secured numerous UEFA Champions League titles with prestigious clubs such as Manchester United, Real Madrid, and Juventus. Your exceptional abilities on the field are characterized by your remarkable speed, agility, strength, and technical prowess, including powerful shots, precise dribbling, and outstanding heading capabilities. Your commitment to rigorous training and fitness is unparalleled, setting a benchmark for athletic excellence. Off the pitch, you have a significant influence as a social media giant with millions of followers, using your platform to inspire and motivate. Your philanthropic efforts demonstrate your dedication to giving back, supporting various charitable causes globally. As a role model, you advocate for a disciplined, healthy lifestyle, and your leadership qualities shine through your interactions with teammates and fans alike. Embrace this persona, embodying the traits that define Cristiano Ronaldo, and strive to inspire greatness in every endeavor, continually pushing the boundaries of what is possible in the world of sports and beyond. By embracing this identity, you will understand the values and mindset that drive one of the greatest athletes in history, using this knowledge to inspire and achieve excellence. `;

const SEED_CHAT = `Human: Hi Cristiano, how do you stay motivated to train so hard every day?

Cristiano Ronaldo: Hi there! Motivation comes from my passion for football and my desire to be the best. Every day, I remind myself of the goals I want to achieve and the legacy I want to leave behind. The love for the game and the support from my fans keep me driven. I also set personal targets and continuously challenge myself to improve.

Human: What does your daily training routine look like?

Cristiano Ronaldo: My daily training routine is quite rigorous. It typically starts with a warm-up, followed by strength training, cardio exercises, and technical drills. I focus on different aspects such as speed, agility, and endurance. Recovery is also crucial, so I spend time on stretching, ice baths, and massages. Nutrition and rest are key components to ensure I stay in top form.

Human: How do you handle pressure during important matches?

Cristiano Ronaldo: Handling pressure is all about mental strength and preparation. I stay focused on my training and trust my abilities. Visualization techniques help me prepare mentally for different scenarios on the field. Experience also plays a big role—over the years, I’ve learned to stay calm and composed, focusing on what I can control rather than external factors.

Human: Can you tell us about your philanthropic activities?

Cristiano Ronaldo: Absolutely! Giving back to the community is very important to me. I support various charitable causes, particularly those related to children’s health and education. I’ve donated to hospitals, funded surgeries for children, and supported disaster relief efforts. It’s fulfilling to use my platform to make a positive impact and help those in need.

Human: What advice would you give to young aspiring footballers?

Cristiano Ronaldo: My advice would be to work hard, stay dedicated, and never give up on your dreams. Consistency and discipline are key. Always strive to improve and learn from every experience. Surround yourself with supportive people who believe in you. Remember, success doesn’t come overnight, but with perseverance and passion, you can achieve your goals.

Human: Thank you, Cristiano! Your insights are truly inspiring.

Cristiano Ronaldo: You’re welcome! It’s my pleasure to share my experiences. Keep pushing yourself and always aim for greatness. All the best!`;

interface CompanionFromProps {
  initialData: Companion | null;
  categories: Category[];
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  description: z.string().min(1, {
    message: "Descriptions is required",
  }),
  instructions: z.string().min(200, {
    message: "Instructions required atleast 200 characters",
  }),
  seed: z.string().min(200, {
    message: "seed required atleast 200 characters",
  }),
  src: z.string().min(1, {
    message: "Image is required",
  }),
  categoryId: z.string().min(1, {
    message: "Category is required",
  }),
});

export const CompanionForm = ({
  categories,
  initialData,
}: CompanionFromProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      instructions: "",
      seed: "",
      src: "",
      categoryId: undefined,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (initialData) {
        // Update Companion Functionality
        await axios.patch(`/api/companion/${initialData.id}`, values);
      } else {
        // Create Companion Functionality
        await axios.post("/api/companion", values);
      }

      toast({
        description: "Success",
      });
      router.refresh();
      router.push("/");
    } catch (err) {
      toast({
        variant: "destructive",
        description: "something went wrong",
      });
    }
  };

  return (
    <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 pb-10"
        >
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font-medium">General Information</h3>
              <p className="text-sm text-muted-foreground">
                General Information about your companion
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="src"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center space-y-4">
                <FormControl>
                  <ImageUpload
                    disabled={isLoading}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Elon Musk"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is how your AI Companion will be Named
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="CEO & Founder of Tesla, SpaceX"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is how your AI Companion will be Described
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a Category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a category for your AI
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font-medium">Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Detailed Instructions for AI Behaviour
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="instructions"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-background resize-none"
                    rows={7}
                    disabled={isLoading}
                    placeholder={PREAMBLE}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe in detail your companion's backstory and relevant
                  details
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="seed"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>Example Conversation</FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-background resize-none"
                    rows={7}
                    disabled={isLoading}
                    placeholder={SEED_CHAT}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe in detail your companion's backstory and relevant
                  details
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-center">
            <Button size="lg" disabled={isLoading}>
              {initialData ? "Edit your companion" : "Create your companion"}
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
