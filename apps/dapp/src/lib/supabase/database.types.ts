export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      crowdfund: {
        Row: {
          description: string;
          discord: string | null;
          email: string | null;
          id: number;
          telegram: string | null;
          testers: string[] | null;
          title: string;
          type: string | null;
        };
        Insert: {
          description?: string;
          discord?: string | null;
          email?: string | null;
          id?: number;
          telegram?: string | null;
          testers?: string[] | null;
          title?: string;
          type?: string | null;
        };
        Update: {
          description?: string;
          discord?: string | null;
          email?: string | null;
          id?: number;
          telegram?: string | null;
          testers?: string[] | null;
          title?: string;
          type?: string | null;
        };
        Relationships: [];
      };
      images: {
        Row: {
          height: number;
          id: number;
          modelHash: string;
          prompt_id: number;
          URL: string;
          width: number;
        };
        Insert: {
          height: number;
          id?: number;
          modelHash?: string;
          prompt_id: number;
          URL?: string;
          width: number;
        };
        Update: {
          height?: number;
          id?: number;
          modelHash?: string;
          prompt_id?: number;
          URL?: string;
          width?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'images_prompt_id_fkey';
            columns: ['prompt_id'];
            isOneToOne: false;
            referencedRelation: 'prompts';
            referencedColumns: ['id'];
          },
        ];
      };
      prompts: {
        Row: {
          crowdfund_id: number;
          id: number;
          prompt: string;
        };
        Insert: {
          crowdfund_id: number;
          id?: number;
          prompt?: string;
        };
        Update: {
          crowdfund_id?: number;
          id?: number;
          prompt?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'prompts_crowdfund_id_fkey';
            columns: ['crowdfund_id'];
            isOneToOne: false;
            referencedRelation: 'crowdfund';
            referencedColumns: ['id'];
          },
        ];
      };
      submitted_models: {
        Row: {
          accepted: boolean | null;
          crowdfund_id: number;
          hash: string | null;
          id: number;
          model_url: string | null;
          owner_address: string | null;
          submitted_at: string;
        };
        Insert: {
          accepted?: boolean | null;
          crowdfund_id: number;
          hash?: string | null;
          id?: number;
          model_url?: string | null;
          owner_address?: string | null;
          submitted_at?: string;
        };
        Update: {
          accepted?: boolean | null;
          crowdfund_id?: number;
          hash?: string | null;
          id?: number;
          model_url?: string | null;
          owner_address?: string | null;
          submitted_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'submitted_models_crowdfund_id_fkey';
            columns: ['crowdfund_id'];
            isOneToOne: false;
            referencedRelation: 'crowdfund';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
