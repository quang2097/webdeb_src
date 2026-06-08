export interface User {
  user_id: string;
  user_name: string;
  user_email: string;
  user_role: string;
  user_islocked: boolean;
}

export interface UserResponse {
  users: User[];
}


export interface UserMeResponse{
  user_id: string;
  user_name: string;
  user_email: string;
  user_role: string;
}

export interface DocumentDetail {
  doc_id: string;
  doc_title: string;
  doc_fileurl: string;
  doc_markdownurl: string;
  doc_status: string;
  doc_error: string;
}

export interface NovelDetail {
  novel_id: string;
  novel_title: string;
  novel_author: string;
  novel_description: string;
  novel_coverurl: string;
  novel_series: string;
  novel_isprivate: boolean;
  novel_views: number;
  novel_downloads: number;
  novel_updatedat: string;
  document: DocumentDetail;
}

