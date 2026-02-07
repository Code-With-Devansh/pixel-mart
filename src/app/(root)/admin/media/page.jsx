'use client';
import BreadCrumb from '@/components/application/admin/BreadCrumb'
import Media from '@/components/application/admin/Media';
import UploadMedia from '@/components/application/admin/UploadMedia'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import useDeleteMutation from '@/hooks/useDeleteMutation';
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from '@/routes/AdminPanelRoute'
import { QueryClient, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const breadCrumbData = [
    {href:ADMIN_DASHBOARD, label:'Home'},
    {href:'', label:'Media'},
]



const MediaPage = () => {
  const [deleteType, setDeleteType] = useState('SD');
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  useEffect(()=>{
    if(searchParams){
      const trashOf = searchParams.get('trashof');
      setSelectedMedia([])
      if(trashOf){
        setDeleteType("PD");
      }else{
        setDeleteType("SD");
      }
    }
  }, [searchParams])
  const fetchMedia = async(page, deleteType)=>{
    const {data:response} = await axios.get(`/api/media?page=${page}&&limit=10&&deleteType=${deleteType}`);
    return response;
  }
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
      queryKey: ['media-data', deleteType],
      queryFn: async({pageParam})=>await fetchMedia(pageParam, deleteType),
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) => {
        const nextPage = pages.length;
        return lastPage.hasMore ? nextPage : null
      },
    })
    const deleteMutation = useDeleteMutation('media-data', '/api/media/delete')
    const handleDelete = (ids, deleteType)=>{
      let c = true;
      if(deleteType === 'PD'){
        c = confirm("Are you sure. You want to delete data permanently?");
      }
      if(c){
        deleteMutation.mutate({ids, deleteType})
      }
      setSelectAll(false);
      setSelectedMedia([]);
    }
    const handleSelectAll = ()=>{
      setSelectAll(!selectAll)
    }
    useEffect(()=>{
      if(selectAll){
        const ids = data.pages.flatMap(page => page.mediaData.map(media=>media._id));
        setSelectedMedia(ids);
      }else{
        setSelectedMedia([])
      }
    }, [selectAll])
  return (
    <>
    <BreadCrumb breadCrumbData={breadCrumbData}/>
    <Card className="py-0 rounded shadow-sm ">
      <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
        <div className='flex justify-between items-center'>
          <h4 className='font-semibold text-xl uppercase'>{
            deleteType === 'SD'?selectedMedia.length==0?"Media":`${selectedMedia.length} item(s) Selected`:"Trash"
        }</h4>
          <div className='flex text-center gap-5'>
            {deleteType === 'SD' && <UploadMedia isMultiple={true} queryClient={queryClient}/>}
            <div className='flex gap-3'>
              {deleteType==='SD'?
                <Button type="button" variant='destructive'><Link href={ADMIN_MEDIA_SHOW+"?trashof=media"}>View Trash</Link></Button>  
            :
            <><Button type="button" ><Link href={ADMIN_MEDIA_SHOW}>Back to Media</Link></Button></>
            }
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {selectedMedia.length > 0 &&
          <div className='py-2 px-3 bg-violet-200 mb-2 rounded flex justify-between items-center'>
            <Label className='cursor-pointer'>
              <Checkbox
                checked={selectAll}
                onCheckedChange={handleSelectAll}
                className='border-primary'
              />
              Select All
            </Label>
            <div className='flex gap-2'>
              {deleteType === 'SD'?
            <Button variant='destructive' onClick= {()=>handleDelete(selectedMedia, deleteType)} className='cursor-pointer'>Move to Trash</Button>  :
            <>
            <Button className='bg-green-500 hover:bg-green-600 cursor-pointer' onClick= {()=>handleDelete(selectedMedia, 'RSD')}>Restore</Button>
            <Button variant='destructive' className='cursor-pointer' onClick= {()=>handleDelete(selectedMedia, deleteType)}>Delete Permanently</Button>
            </>
            }
            </div>
          </div>
        }
        {
          status === 'pending'
          ?
            <div className='flex justify-center text-2xl'><Spinner className='animate-spin'/></div>
          :
            status==='error'?
              <div className='text-red-500 text-sm'>{error.message}</div>
            :
            <>
              {data.pages.flatMap(page => page.mediaData.map(media=>media._id)).length === 0 && <div className='text-center'> No media

                </div>}
              <div className='grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5'>
                {
                  data?.pages?.map((page, index)=>(
                    <React.Fragment key={index}>
                      {
                        page?.mediaData.map((media)=>(
                          <div key={media._id}>
                            <Media 
                              key={media._id}
                              media={media}
                              handleDelete={handleDelete}
                              deleteType={deleteType}
                              selectedMedia={selectedMedia}
                              setSelectedMedia={setSelectedMedia}
                            />
                          </div>
                        ))
                      }
                    </React.Fragment>
                  ))
                }
              </div>

              </>
        }
      </CardContent>
    </Card>
    </>
  )
}

export default MediaPage